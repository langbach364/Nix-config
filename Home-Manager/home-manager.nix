{ pkgs, ... }:

{
  # Enable home-manager
  programs.home-manager = {
    enable = true;
  };

  imports = [ 
    ./host/application/vscodium.nix
    ./host/application/fcitx5-bamboo.nix
    ./host/package.nix
  ];

  # Specify home-manager settings
  targets.genericLinux.enable = true;

  home = {
    username = "langbach364";
    homeDirectory = "/home/${username}";
    stateVersion = "24.05";
    packages = [ ];
  };
}
