{ config, pkgs, ... }:

{
  home.packages = with pkgs; [
    docker
    docker-compose
  ];

  systemd.user.services.docker = {
    Unit = {
      Description = "Docker Application Container Engine";
      Documentation = ["man:docker(1)"];
    };
    Service = {
      ExecStart = "${pkgs.docker}/bin/dockerd";
      Type = "notify";
    };
    Install = {
      WantedBy = ["default.target"];
    };
  };
}
