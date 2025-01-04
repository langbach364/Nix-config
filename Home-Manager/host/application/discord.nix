{ pkgs, ... }: {
  nixpkgs.config.allowUnfree = true;
  
  home.packages = with pkgs; [
    discord
  ];

  xdg = {
    enable = true;
    desktopEntries.discord = {
      name = "Discord";
      genericName = "Internet Messenger";
      comment = "All-in-one voice and text chat for gamers";
      exec = "${pkgs.discord}/bin/discord --enable-wayland-ime";
      icon = "discord";
      categories = [ "Network" "InstantMessaging" ];
      startupNotify = true;
      type = "Application";
    };
  };
}