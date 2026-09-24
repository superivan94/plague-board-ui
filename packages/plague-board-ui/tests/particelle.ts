/**
 * Le particelle in volo.
 *
 * ⚠️ Si cercano nel **documento** e non nel contenitore reso: stanno in un portale sul `body`, che
 * è ciò che le salva dal taglio di qualunque antenato col traboccamento nascosto — e quel portale
 * è anche il motivo per cui questa riga non può usare il `container` di `render`.
 */
export const particelle = () => document.querySelectorAll('.pb-particle');
