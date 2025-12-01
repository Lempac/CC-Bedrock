{ pkgs, ... }:

{
  packages = with pkgs; [ nixd regolith ];
  languages.nix.enable = true;
  languages.deno.enable = true;
}
