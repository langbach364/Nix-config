{ pkgs, ... }:

{
  home.packages = with pkgs; [
    (wrapOBS {
      plugins = with obs-studio-plugins; [
        obs-backgroundremoval
      ];
    })
  ];
}
