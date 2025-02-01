{ ... }:

{
  # Enable home-manager
  programs.home-manager = {
    enable = true;
  };

  imports = [ 
    ./host/package.nix
   ./module/nbfc-gui/package/nbfc-gui.nix
   ./module/package_pkg-config.nix
  ];

  # Specify home-manager settings
  targets.genericLinux.enable = true;

  home = {
    username = "bachlang364";
    homeDirectory = "/home/bachlang364";
    stateVersion = "24.11";
    packages = [ ];
  };
}
