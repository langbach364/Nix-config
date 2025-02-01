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
      exec = "${pkgs.vscodium}/bin/codium --reuse-window --enable-wayland-ime %F";
      icon = "vscodium";
      mimeType = [
        "text/plain"
        "inode/directory"
      ];
      categories = [ "Utility" "TextEditor" "Development" "IDE" ];
      startupNotify = true;
      type = "Application";
    };

    # Handler cho URLs và extensions
    desktopEntries.codium-url-handler = {
      name = "VSCodium URL Handler";
      noDisplay = true;
      exec = "${pkgs.vscodium}/bin/codium --open-url %U";
      type = "Application";
      mimeType = [ 
        "x-scheme-handler/vscode"
        "x-scheme-handler/vscodium" 
      ];
    };

    mimeApps = {
      enable = true;
      defaultApplications = {
        "x-scheme-handler/vscode" = ["codium-url-handler.desktop"];
        "x-scheme-handler/vscodium" = ["codium-url-handler.desktop"];
        
        "text/plain" = ["codium.desktop"];
        "inode/directory" = ["codium.desktop"];
      };
    };
  };

  home.sessionVariables = {
    BROWSER = "${pkgs.vscodium}/bin/codium";
    VSCODE_PROTOCOL_HANDLER = "true";
  };
}
