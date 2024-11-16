{ config, pkgs, ... }:

{
  i18n.inputMethod = {
    enable = true;
    type = "fcitx5";
    fcitx5.addons = with pkgs; [
      fcitx5
      fcitx5-bamboo
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
