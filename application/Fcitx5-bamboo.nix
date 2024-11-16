{ config, pkgs, ... }:

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
in {
  i18n.inputMethod = {
    enable = true;
    type = "fcitx5";
    fcitx5.addons = with pkgs; [
      fcitx5
      (pkgs.stdenv.mkDerivation {
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
      })
      fcitx5-configtool
    ];
  };

  environment = {
    sessionVariables = {
      GTK_IM_MODULE = "fcitx";
      QT_IM_MODULE = "fcitx";
      XMODIFIERS = "@im=fcitx";
      SDL_IM_MODULE = "fcitx";
      GLFW_IM_MODULE = "fcitx";
      INPUT_METHOD = "fcitx";
    };
    pathsToLink = [ "/share" ];
  };

  systemd.user.services.fcitx5-daemon = {
    description = "Fcitx5 input method editor";
    wantedBy = [ "default.target" ];
    after = [ "graphical-session.target" ];
    serviceConfig = {
      ExecStart = "${pkgs.fcitx5}/bin/fcitx5";
    };
  };
}
