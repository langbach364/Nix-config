{ config, pkgs, lib, ... }: {
  home.packages = with pkgs; [
    (vscodium.override {
      commandLineArgs = "--enable-wayland-ime";
    })
  ];

  xdg = {
    enable = true;
    desktopEntries.vscodium = {
      name = "VSCodium";
      genericName = "Text Editor";
      comment = "Code Editing. Redefined.";
      exec = "${pkgs.vscodium}/bin/codium --open-url %U";
      icon = "vscodium";
      mimeType = [ 
        "x-scheme-handler/vscode"
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
        "x-scheme-handler/vscode" = ["vscodium.desktop"];
        "x-scheme-handler/vscodium" = ["vscodium.desktop"];
        "text/plain" = ["vscodium.desktop"];
      };
    };
  };

  home.sessionVariables = {
    BROWSER = "${pkgs.vscodium}/bin/codium";
    VSCODE_PROTOCOL_HANDLER = "true";
    XDG_VSCODIUM_DIRS = "${config.home.profileDirectory}/share:$XDG_VSCODIUM_DIRS";
  };

  systemd.user.services.vscodium-desktop-override = {
    Unit = {
      Description = "Override VSCodium desktop entry";
      After = "graphical-session.target";
    };
    Service = {
      Type = "oneshot";
      ExecStart = "${pkgs.coreutils}/bin/ln -sf ${config.home.profileDirectory}/share/applications/vscodium.desktop /usr/share/applications/vscodium.desktop";
    };
    Install = {
      WantedBy = ["graphical-session.target"];
    };
  };

  targets.genericLinux.enable = true;
}
