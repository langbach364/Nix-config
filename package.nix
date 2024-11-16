{ config, pkgs, ... }:

{
  imports = [
    ./application/Vscodium.nix
    ./application/Fcitx5-bamboo.nix
  ];

  environment.systemPackages = with pkgs; [
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
