{pkgs, lib, ... }: {
  home.packages = with pkgs; [
    vscodium
  ];

  xdg = {
    enable = true;
    desktopEntries.codium = {
      name = "VSCodium";
      genericName = "Text Editor";
      comment = "Code Editing. Redefined.";
      exec = "${pkgs.vscodium}/bin/codium --open-url --enable-wayland-ime %U";
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
        "x-scheme-handler/vscodium" = ["codium.desktop" "codium-url-handler.desktop"];
        "text/plain" = ["codium.desktop" "codium-url-handler.desktop"];
      };
    };
  };

  home.sessionVariables = {
    BROWSER = "${pkgs.vscodium}/bin/codium";
    VSCODE_PROTOCOL_HANDLER = "true";
    XDG_VSCODIUM_DIRS = lib.mkForce "${pkgs.vscodium}/share:$HOME/.nix-profile/share:$XDG_VSCODIUM_DIRS";
  };
}
