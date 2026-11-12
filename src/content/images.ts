const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const IMAGES = {
  rosalie: {
    src: u('photo-1777203005395-316ab605600d'),
    alt: 'Une rosalie à quatre roues avec un toit rouge au milieu d’un espace boisé',
    credit: 'Wenzy Wong / Unsplash',
  },
  laRochelle: {
    src: u('photo-1587931693473-9598be66ae1c'),
    alt: 'Les tours médiévales du Vieux-Port de La Rochelle sous un ciel nuageux',
    credit: 'Guillaume QL / Unsplash',
  },
  laRochelleQuai: {
    src: u('photo-1689414978171-4fd246a77571'),
    alt: 'Des habitants assis au bord du quai regardent passer un bateau à La Rochelle',
    credit: 'Xavier Foucrier / Unsplash',
  },
  village: {
    src: u('photo-1791822106967-bd430884b182'),
    alt: 'Rue calme d’un village de montagne aux maisons de pierre, avec un versant boisé en arrière-plan',
    credit: 'Ionel Lagaillarde / Unsplash',
  },
  velos: {
    src: u('photo-1452573992436-6d508f200b30'),
    alt: 'Deux cyclistes roulent côte à côte sur une route',
    credit: 'Maico Amorim / Unsplash',
  },
}
