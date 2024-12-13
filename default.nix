{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs-18_x  # Node.js sürümünü burada ayarlayın
    pkgs.yarn         # veya pkgs.npm, tercihinize göre
  ];

  shellHook = ''
    echo "Setting up environment with SWC support"

    # node_modules dizinini yeniden oluşturun
    if [ ! -d "node_modules" ]; then
      yarn install
    fi

    # SWC bindinglerini yeniden kurun
    yarn rebuild @swc/core || npm rebuild @swc/core
  '';
}
