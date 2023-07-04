// LICENSE: GNU GPL v3 You should have received a copy of the GNU General
// Public License along with this program. If not, see 
// https://www.gnu.org/licenses/.

/////////////////////// symbol-pocker.mjs ///////////////////////////////
// A UI widget for inserting symbols                                   //
/////////////////////////////////////////////////////////////////////////

import ogDialog from './dialog.mjs';

const symbols = {
    " " : "non-breaking space",
    " " : "thin space",
    "-" : "hyphen",
    "–" : "en-dash",
    "—" : "em-dash",
    "…" : "ellipsis",
    "‘" : "left single quote",
    "’" : "right single quote/apostrophe",
    "“" : "left double quote",
    "”" : "right double quote",
    "ʹ" : "prime",
    "ʺ" : "double prime",
    "'" : "straight single quote",
    "\"" : "straight double quote",
    "†": "dagger",
    "‡" : "double dagger",
    "•" : "bullet",
    "§" : "section",
    "¶" : "paragraph",
    "¬" : "negation",
    "∀" : "for all",
    "∃" : "exists",
    "∅" : "null set",
    "∈" : "membership",
    "∉" : "non-membership",
    "∧" : "conjunction",
    "∨" : "disjunction",
    "∩" : "intersection",
    "∪" : "union",
    "∴" : "therefore",
    "≅" : "congruence",
    "≈" : "similarity",
    "≠" : "inequality",
    "≡" : "equivalence",
    "⊂" : "proper subset",
    "⊃" : "proper superset/material implication",
    "⊆" : "subset",
    "⊇" : "superset",
    "⊢" : "turnstile",
    "⊨" : "double turnstile",
    "⊥" : "absurdity",
    "←" : "left arrow",
    "↑" : "up arrow",
    "→" : "right arrow",
    "↓" : "down arrow",
    "↔" : "left right arrow",
    "↕" : "up down arrow",
    "⇐" : "left double arrow",
    "⇑" : "up double arrow",
    "⇒" : "right double arrow",
    "⇓" : "down double arrow",
    "⇔" : "left right double arrow",
    "⇕" : "up down double arrow",
    "⌜" : "left corner quote",
    "⌝" : "right corner quote",
    "□" : "box",
    "◇" : "diamond",
    "⥽" : "fishtail",
    "℩" : "inverted iota",
    "ℵ" : "aleph",
    "ℶ" : "bet",
    "℘" : "Weierstrass p",
    "−" : "minus",
    "×" : "multiply/times",
    "÷" : "divided by",
    "≤" : "less than or equal to",
    "≥" : "greater than or equal to",
    "∑" : "summation",
    "∏" : "bounded product",
    "∫" : "integral",
    "∂" : "derivative",
    "∇" : "difference",
    "√" : "square root",
    "∞" : "infinity",
    "±" : "plus/minus",
    "½" : "one half",
    "©" : "copyright sign",
    "¡" : "inverted exclamation",
    "¿" : "inverted question mark",
    "¢" : "cents",
    "£" : "pounds",
    "€" : "euro",
    "°" : "degrees",
    "™" : "trademark",
    "©" : "copyright",
    "®" : "registered",
    "‹" : "left angle quotation mark",
    "›" : "right angle quotation mark",
    "«" : "left double angle quotation mark",
    "»" : "right double angle quotation mark",
    "‚" : "low single quotation mark",
    "„" : "low double quotation mark", 
    "⟨" : "left angle bracket",
    "⟩" : "right angle bracket",
    "ß" : "Ess Zed",
    "À" : "A grave accent",
    "Á" : "A acute accent",
    "Â" : "A circumflex",
    "Ã" : "A tilde",
    "Ä" : "A umlaut",
    "Å" : "A ring",
    "Æ" : "AE",
    "Ç" : "C cedilla",
    "È" : "E grave",
    "É" : "E acute",
    "Ê" : "E circumflex",
    "Ë" : "E umlaut",
    "Ì" : "I grave",
    "Í" : "I acute",
    "Î" : "I circumflex",
    "Ï" : "I umlaut",
    "Ñ" : "N tilde",
    "Ò" : "O grave",
    "Ó" : "O actue",
    "Ô" : "O circumflex",
    "Õ" : "O tilde",
    "Ö" : "O umlaut",
    "Ø" : "slashed O",
    "Ù" : "U grave",
    "Ú" : "U acute",
    "Û" : "U circumflex",
    "Ü" : "U umlaut",
    "Ý" : "Y acute",
    "à" : "a grave",
    "á" : "a acute",
    "â" : "a circumflex",
    "ã" : "a tilde",
    "ä" : "a umlaut",
    "å" : "a ring",
    "æ" : "ae",
    "ç" : "c cedilla",
    "è" : "e grave",
    "é" : "e acute",
    "ê" : "e circumflex",
    "ë" : "e umlaut",
    "ì" : "i grave",
    "í" : "i acute",
    "î" : "i circumflex",
    "ï" : "i umlaut",
    "ñ" : "n tilde",
    "ò" : "o grave",
    "ó" : "o acute",
    "ô" : "o circumflex",
    "õ" : "o tilde",
    "ö" : "o umlaut",
    "ø" : "slashed o",
    "ù" : "u acute",
    "ú" : "u grave",
    "û" : "u circumflex",
    "ü" : "u umlaut",
    "ý" : "y acute",
    "Α" : "Alpha",
    "Β" : "Beta",
    "Γ" : "Gamma",
    "Δ" : "Delta",
    "Ε" : "Epsilon",
    "Ζ" : "Zeta",
    "Η" : "Eta",
    "Θ" : "Theta",
    "Ι" : "Iota",
    "Κ" : "Kappa",
    "Λ" : "Lambda",
    "Μ" : "Mu",
    "Ν" : "Nu",
    "Ξ" : "Xi",
    "Ο" : "Omicron",
    "Π" : "Pi",
    "Ρ" : "Rho",
    "Σ" : "Sigma",
    "Τ" : "Tau",
    "Υ" : "Upsilon",
    "Φ" : "Phi",
    "Χ" : "Chi",
    "Ψ" : "Psi",
    "Ω" : "Omega",
    "α" : "alpha",
    "β" : "beta",
    "γ" : "gamma",
    "δ" : "delta",
    "ε" : "epsilon",
    "ζ" : "zeta",
    "η" : "eta",
    "θ" : "theta",
    "ι" : "iota",
    "κ" : "kappa",
    "λ" : "lambda",
    "μ" : "mu",
    "ν" : "nu",
    "ξ" : "xi",
    "ο" : "omicron",
    "π" : "pi",
    "ρ" : "rho",
    "ς" : "final sigma",
    "σ" : "sigma",
    "τ" : "tau",
    "υ" : "upsilon",
    "φ" : "phi",
    "χ" : "chi",
    "ψ" : "psi",
    "ω" : "omega",
    "ϑ" : "theta variant",
    "ϕ" : "phi variant"
}

export default function symbolPicker(callback, sz = 20) {
    let ctr=0;
    let h = '<div class="symbolpicker"><table><tbody><tr>';
    for (let c in symbols) {
        h += '<td title="' + symbols[c] + '">' + c + '</td>';
        ctr++;
        if ((ctr % sz) == 0) { h+= '</tr><tr>'; }
    }
    while ((ctr % sz) != 0) { h+='<td></td>'; ctr++ }
    h += '</tr></tbody></table></div>';
    const bigDiv = ogDialog.popupform(h);
    const tdtd = bigDiv.getElementsByTagName("td");
    for (let td of tdtd) {
        td.callback = callback;
        td.myBDiv = bigDiv;
        td.onclick = function(){
            this.callback(this.innerHTML);
            this.myBDiv.closeMe();
        };
    }
}

