{ config, pkgs, ... }: {
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
