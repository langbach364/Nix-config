{ pkgs, lib, ... }:

let
  vscodium-overlay = self: super: {
    vscodium = super.vscodium.overrideAttrs (old: {
      version = "1.96.4.25026";
      src = pkgs.fetchurl {
        url = "https://github.com/VSCodium/vscodium/releases/download/1.96.4.25026/VSCodium-linux-x64-1.96.4.25026.tar.gz";
        sha256 = "095ilb9b8703lik5ssgs94b7z640pnmwwphnrilwzdj639ldjzf8";
      };
      
      installPhase = ''
        mkdir -p $out/{lib/vscodium,bin,share/pixmaps,share/icons/hicolor/*/apps}
        cp -r . $out/lib/vscodium
        ln -sf $out/lib/vscodium/bin/codium $out/bin/codium
        ln -sf $out/lib/vscodium/bin/codium $out/bin/vscodium
        cp -r resources/app/resources/linux/code.png $out/share/{pixmaps/vscodium.png,icons/hicolor/*/apps/vscodium.png}
      '';
      
      postFixup = ''
        wrapProgram $out/bin/codium \
          --add-flags "--enable-wayland-ime"
      '';
    });
  };
in
{
  nixpkgs.overlays = [ vscodium-overlay ];

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