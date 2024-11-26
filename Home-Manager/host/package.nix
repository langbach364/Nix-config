{ pkgs, ... }: {

imports = [
    ./application/vscodium.nix
    ./application/fcitx5-bamboo.nix
    ./application/obs.nix
    ./application/docker.nix
    ./application/discord.nix
];

  home.packages = with pkgs; [
    go
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
   
  ];
}
