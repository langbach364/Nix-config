{ config, pkgs, lib, ... }:

let
  fcitx5-bamboo = pkgs.fetchFromGitHub {
    owner = "fcitx";
    repo = "fcitx5-bamboo";
    rev = "1.0.6";
    sha256 = "1k7c14kpskcs68l0vdydalsfsd122wymhd47l65m22p1rgch0mq2";
  };

  bamboo-core = pkgs.fetchFromGitHub {
    owner = "BambooEngine";
    repo = "bamboo-core";
    rev = "b2e49a2b48c7d3772a3673142a7747eccd9d5f79";
    sha256 = "026z1kppw9zvb0p4s9kfjnbj4x3p3fjrf288q3cbiaikimk594q1";
  };

  fcitx5-bamboo-pkg = pkgs.stdenv.mkDerivation {
    pname = "fcitx5-bamboo";
    version = "1.0.6";
    
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

    GOCACHE = "/tmp/go-cache";
    GOPATH = "/tmp/go";
    
    preConfigurePhases = ["preBuildPhase"];
    preBuildPhase = ''
      mkdir -p bamboo
      cp -r ${bamboo-core}/* bamboo/bamboo-core/
    '';

    cmakeFlags = [
      "-DCMAKE_INSTALL_PREFIX=${placeholder "out"}"
      "-DCMAKE_INSTALL_LIBDIR=lib"
    ];
  };

in {
  i18n.inputMethod = lib.mkForce {
    enabled = "fcitx5";
    package = pkgs.fcitx5-with-addons.override {
      addons = [ fcitx5-bamboo-pkg ];
    };
  };

  home.sessionVariables = {
    GTK_IM_MODULE = "fcitx";
    QT_IM_MODULE = "fcitx";
    XMODIFIERS = "@im=fcitx";
    SDL_IM_MODULE = "fcitx";
    INPUT_METHOD = "fcitx";
    XDG_FCITX5_DIRS = lib.mkForce "${pkgs.fcitx5-with-addons}/share:$HOME/.nix-profile/share:$XDG_FCITX5_DIRS";
  };
}
