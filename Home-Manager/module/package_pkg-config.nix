{ pkgs, lib, ... }:

{
  home.packages = with pkgs; [
    alsa-lib.dev
  ];

  home.activation = {
    linkAlsaPkgConfig = lib.hm.dag.entryAfter ["writeBoundary"] ''
      mkdir -p $HOME/.local/lib/pkgconfig
      ln -sf ${pkgs.alsa-lib.dev}/lib/pkgconfig/* $HOME/.local/lib/pkgconfig/
    '';
  };
}
