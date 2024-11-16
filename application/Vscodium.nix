{ config, pkgs, ... }:
{
  environment.systemPackages = with pkgs; [
    (vscodium.override {
      commandLineArgs = "--enable-wayland-ime";
    })
  ];

  xdg.mime.defaultApplications = {
    "x-scheme-handler/vscodium" = "codium.desktop";
  };

  environment.sessionVariables = {
    BROWSER = "codium";
  };
}
