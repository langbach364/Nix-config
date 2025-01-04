{ pkgs, ... }: {
  imports = [
    ./application/vscodium.nix
    ./application/fcitx5-bamboo.nix
    ./application/obs.nix
    ./application/discord.nix
  ];

  home.packages = with pkgs; [
    nil
    nixpkgs-fmt
    direnv
    nixd
    alejandra
    statix
    deadnix
    nix-tree
    manix
    nix-index
    go
    nodejs_latest
    libsecret
  ];

  # Cho phép Direnv
  programs.direnv = {
    enable = true;
    nix-direnv.enable = true;
  };
}

