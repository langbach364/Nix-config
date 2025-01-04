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
    username = "langbach364";
    homeDirectory = "/home/langbach364";
    stateVersion = "24.05";
    packages = [ ];
  };
}
