{ pkgs, ... }: {
  imports = [
    ./application/vscodium.nix
    ./application/fcitx5-bamboo.nix
    ./application/obs.nix
    ./application/discord.nix
    ./application/telegram.nix
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
    solc
    python39
    zip
    unzip
    rar
    expect
    ansifilter
  ];

  # Cho phép Direnv
  programs.direnv = {
    enable = true;
    nix-direnv.enable = true;
  };
}

