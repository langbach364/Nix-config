{ pkgs, lib, ... }:

{
  home.packages = with pkgs; [
    telegram-desktop
  ];

  xdg = {
    enable = true;
    desktopEntries.telegram = {
      name = "Telegram";
      genericName = "Messenger";
      comment = "Official desktop version of Telegram messaging app";
      exec = "${pkgs.telegram-desktop}/bin/telegram-desktop -startintray --enable-wayland-ime %u";
      icon = "telegram";
      mimeType = [
        "x-scheme-handler/tg"
      ];
      categories = [ "Network" "InstantMessaging" "Chat" ];
      startupNotify = true;
      type = "Application";
    };

    mimeApps = {
      enable = true;
      defaultApplications = {
        "x-scheme-handler/tg" = ["telegram.desktop"];
      };
    };
  };

  # Không định nghĩa lại các biến môi trường đã được định nghĩa trong fcitx5-bamboo.nix
  home.sessionVariables = {
    QT_QPA_PLATFORM = "wayland";
    # Bỏ định nghĩa QT_IM_MODULE và XMODIFIERS vì đã có trong fcitx5-bamboo.nix
  };
}
