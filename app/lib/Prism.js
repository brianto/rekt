import Prism from 'prism';
export default Prism;

// Import order matters! Some language definitions depend on other definitions
// that are not standard. Those need to be defined first. Yes, dependencies are
// handled manually :-(
//
// To get the dependency list in (base, language) form, run in the project
// base...
//
// find bower_components/prism/components -name "*.min.js" \
// | xargs grep "Prism\.languages\.extend" \
// | sed -e "s/.*prism-\([a-z]*\)\.min.*extend(\"\([a-z]*\)\".*/\2,\1/" \
// | sort
//
// The default prism.js provides the following languages by default:
// * prism-css
// * prism-clike
// * prism-javascript
// * markup

import 'prism/components/prism-c';
import 'prism/components/prism-java';
import 'prism/components/prism-ruby';

import 'prism/components/prism-abap';
import 'prism/components/prism-actionscript';
import 'prism/components/prism-ada';
import 'prism/components/prism-apacheconf';
import 'prism/components/prism-apl';
import 'prism/components/prism-applescript';
import 'prism/components/prism-asciidoc';
import 'prism/components/prism-aspnet';
import 'prism/components/prism-autohotkey';
import 'prism/components/prism-autoit';
import 'prism/components/prism-bash';
import 'prism/components/prism-basic';
import 'prism/components/prism-batch';
import 'prism/components/prism-bison';
import 'prism/components/prism-brainfuck';
import 'prism/components/prism-bro';
import 'prism/components/prism-coffeescript';
import 'prism/components/prism-cpp';
import 'prism/components/prism-crystal';
import 'prism/components/prism-csharp';
import 'prism/components/prism-css-extras';
import 'prism/components/prism-d';
import 'prism/components/prism-dart';
import 'prism/components/prism-diff';
import 'prism/components/prism-docker';
import 'prism/components/prism-eiffel';
import 'prism/components/prism-elixir';
import 'prism/components/prism-erlang';
import 'prism/components/prism-fortran';
import 'prism/components/prism-fsharp';
import 'prism/components/prism-gherkin';
import 'prism/components/prism-git';
import 'prism/components/prism-glsl';
import 'prism/components/prism-go';
import 'prism/components/prism-graphql';
import 'prism/components/prism-groovy';
import 'prism/components/prism-haml';
import 'prism/components/prism-handlebars';
import 'prism/components/prism-haskell';
import 'prism/components/prism-haxe';
import 'prism/components/prism-http';
import 'prism/components/prism-icon';
import 'prism/components/prism-inform7';
import 'prism/components/prism-ini';
import 'prism/components/prism-j';
import 'prism/components/prism-jade';
import 'prism/components/prism-jolie';
import 'prism/components/prism-json';
import 'prism/components/prism-jsx';
import 'prism/components/prism-julia';
import 'prism/components/prism-keyman';
import 'prism/components/prism-kotlin';
import 'prism/components/prism-latex';
import 'prism/components/prism-less';
import 'prism/components/prism-livescript';
import 'prism/components/prism-lolcode';
import 'prism/components/prism-lua';
import 'prism/components/prism-makefile';
import 'prism/components/prism-markdown';
import 'prism/components/prism-matlab';
import 'prism/components/prism-mel';
import 'prism/components/prism-mizar';
import 'prism/components/prism-monkey';
import 'prism/components/prism-nasm';
import 'prism/components/prism-nginx';
import 'prism/components/prism-nim';
import 'prism/components/prism-nix';
import 'prism/components/prism-nsis';
import 'prism/components/prism-objectivec';
import 'prism/components/prism-ocaml';
import 'prism/components/prism-oz';
import 'prism/components/prism-parigp';
import 'prism/components/prism-parser';
import 'prism/components/prism-pascal';
import 'prism/components/prism-perl';
import 'prism/components/prism-php';
import 'prism/components/prism-php-extras';
import 'prism/components/prism-powershell';
import 'prism/components/prism-processing';
import 'prism/components/prism-prolog';
import 'prism/components/prism-properties';
import 'prism/components/prism-protobuf';
import 'prism/components/prism-puppet';
import 'prism/components/prism-pure';
import 'prism/components/prism-python';
import 'prism/components/prism-q';
import 'prism/components/prism-qore';
import 'prism/components/prism-r';
import 'prism/components/prism-reason';
import 'prism/components/prism-rest';
import 'prism/components/prism-rip';
import 'prism/components/prism-roboconf';
import 'prism/components/prism-rust';
import 'prism/components/prism-sas';
import 'prism/components/prism-sass';
import 'prism/components/prism-scala';
import 'prism/components/prism-scheme';
import 'prism/components/prism-scss';
import 'prism/components/prism-smalltalk';
import 'prism/components/prism-smarty';
import 'prism/components/prism-sql';
import 'prism/components/prism-stylus';
import 'prism/components/prism-swift';
import 'prism/components/prism-tcl';
import 'prism/components/prism-textile';
import 'prism/components/prism-twig';
import 'prism/components/prism-typescript';
import 'prism/components/prism-verilog';
import 'prism/components/prism-vhdl';
import 'prism/components/prism-vim';
import 'prism/components/prism-wiki';
import 'prism/components/prism-xojo';
import 'prism/components/prism-yaml';
