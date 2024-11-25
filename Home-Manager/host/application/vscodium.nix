{ config, pkgs, lib, ... }: {
  home.packages = with pkgs; [
    (vscodium.override {
      commandLineArgs = "--enable-wayland-ime --enable-features=UseOzonePlatform --ozone-platform=wayland --enable-smooth-scrolling";
    })
  ];

  xdg = {
    enable = true;
    desktopEntries.codium = {
      name = "VSCodium";
      genericName = "Text Editor";
      comment = "Code Editing. Redefined.";
      exec = "${pkgs.vscodium}/bin/codium --open-url %U";
      icon = "vscodium";
      mimeType = [
        "x-scheme-handler/vscodium"
        "text/plain"
        "inode/directory"
      ];
      categories = [ "Utility" "TextEditor" "Development" "IDE" ];
      startupNotify = true;
      type = "Application";
    };

    mimeApps = {
      enable = true;
      defaultApplications = {
        "x-scheme-handler/vscodium" = ["codium.desktop"];
        "text/plain" = ["codium.desktop"];
      };
    };
  };

  home.sessionVariables = {
    BROWSER = "${pkgs.vscodium}/bin/codium";
    VSCODE_PROTOCOL_HANDLER = "true";
    XDG_VSCODIUM_DIRS = lib.mkForce "${pkgs.vscodium}/share:$HOME/.nix-profile/share:$XDG_VSCODIUM_DIRS";
  };
}
