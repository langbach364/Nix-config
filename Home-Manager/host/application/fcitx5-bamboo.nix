{ pkgs, ... }:

let
  fcitx5-overlay = self: super: {
    fcitx5 = super.fcitx5.overrideAttrs (old: {
      version = "5.1.12";
      src = pkgs.fetchFromGitHub {
        owner = "fcitx";
        repo = "fcitx5";
        rev = "5.1.12";
        sha256 = "1kibllllnysv28zmhl95q84dyprhbc99b3d7yhkmcqzbm5ixhki6";
      };
    });
  };

  fcitx5-bamboo = pkgs.fetchFromGitHub {
    owner = "fcitx";
    repo = "fcitx5-bamboo";
    rev = "1.0.7";
    sha256 = "ofQIoaflCUBwR6M/PqYk7Z+KqXjumH6gC6dzUFG0gNs=";
  };

  bamboo-core = pkgs.fetchFromGitHub {
    owner = "BambooEngine";
    repo = "bamboo-core";
    rev = "b2e49a2b48c7d3772a3673142a7747eccd9d5f79";
    sha256 = "026z1kppw9zvb0p4s9kfjnbj4x3p3fjrf288q3cbiaikimk594q1";
  };

  fcitx5-bamboo-pkg = pkgs.stdenv.mkDerivation {
    pname = "fcitx5-bamboo";
    version = "1.0.7";
    
    src = fcitx5-bamboo;
    
    nativeBuildInputs = with pkgs; [
      cmake
      extra-cmake-modules
      pkg-config
      go
      git
    ];
    
    buildInputs = with pkgs; [
      fcitx5
      gettext
      fmt
    ];

    cmakeFlags = [
      "-DCMAKE_INSTALL_PREFIX=${placeholder "out"}"
      "-DCMAKE_INSTALL_LIBDIR=lib"
      "-DFCITX_VERSION=5.1.12"
    ];

    GOCACHE = "/tmp/go-cache";
    GOPATH = "/tmp/go";
    
    preConfigurePhases = ["preBuildPhase"];
    preBuildPhase = ''
      mkdir -p bamboo
      cp -r ${bamboo-core}/* bamboo/bamboo-core/
    '';
  };

  fcitx5-full = pkgs.fcitx5-with-addons.override {
    addons = [ fcitx5-bamboo-pkg ];
  };
in
{
  nixpkgs.overlays = [ fcitx5-overlay ];

  home.packages = [
    fcitx5-full
  ];

  home.sessionVariables = {
    GTK_IM_MODULE = "fcitx";
    QT_IM_MODULE = "fcitx";
    XMODIFIERS = "@im=fcitx";
    SDL_IM_MODULE = "fcitx";
    INPUT_METHOD = "fcitx";
    XDG_FCITX5_DIRS = "${fcitx5-full}/share:$HOME/.nix-profile/share:$XDG_FCITX5_DIRS";
  };
}

