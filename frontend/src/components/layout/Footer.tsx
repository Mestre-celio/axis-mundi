export function Footer() {
  return (
    <footer className="border-t py-12" style={{ borderColor: 'rgba(229, 193, 88, 0.1)', background: '#0A0618' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="font-display text-lg" style={{
              background: 'linear-gradient(135deg, #FFF5C0 0%, #E5C158 50%, #946E19 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>PORTAL AXIUM</span>
            <p className="mt-2 text-sm text-gray-500">
              Portal Oracle das Religiões — onde a sabedoria ancestral encontra a tecnologia.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Oráculos</h4>
            <ul className="mt-3 space-y-2">
              {['Tarot', 'Ifá', 'Runas', 'I Ching', 'Orixás'].map((o) => (
                <li key={o}>
                  <a href="#" className="text-sm text-gray-500 hover:text-[#E5C158] transition-colors">{o}</a>
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
        <div className="mt-8 pt-8 border-t text-center" style={{ borderColor: 'rgba(229, 193, 88, 0.1)' }}>
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Portal Axium. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
