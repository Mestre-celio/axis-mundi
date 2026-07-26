export function Footer() {
  return (
    <footer className="border-t border-gold-500/10 bg-midnight-500 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="font-display text-lg text-gold-500">AXIS MUNDI</span>
            <p className="mt-2 text-sm text-gray-500">
              Portal Oracle das Religiões — onde a sabedoria ancestral encontra a tecnologia.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Oráculos</h4>
            <ul className="mt-3 space-y-2">
              {['Tarot', 'Ifá', 'Runas', 'I Ching', 'Orixás'].map((o) => (
                <li key={o}>
                  <a href="#" className="text-sm text-gray-500 hover:text-gold-500">{o}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Ética</h4>
            <p className="mt-3 text-sm text-gray-500">
              Honramos todas as tradições. O livre arbítrio é soberano. Nenhuma leitura substitui aconselhamento profissional.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gold-500/10 text-center">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Axis Mundi. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
