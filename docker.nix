{ config, pkgs, ... }:

{
  virtualisation.docker = {
    enable = true;
    enableOnBoot = true;
  };

  users.users.langbach364.extraGroups = [ "docker" ];

  environment.systemPackages = with pkgs; [
    docker
    docker-compose
  ];
}

