// src/lib/data.ts

export interface CuisineIdea {
  name: string;
  description: string;
  imageHint: string; // for placeholder image data-ai-hint
}

export const cuisineIdeas: Record<string, CuisineIdea[]> = {
  'long grain': [
    { name: 'Pilaf', description: 'Aromatic rice dish cooked in broth, often with spices, vegetables, or meat.', imageHint: 'rice pilaf' },
    { name: 'Fried Rice', description: 'Stir-fried rice with eggs, vegetables, seafood, or meat. A versatile classic.', imageHint: 'fried rice' },
    { name: 'Jollof Rice', description: 'A popular West African dish made with long-grain rice, tomatoes, onions, spices, vegetables and meat.', imageHint: 'jollof rice' },
  ],
  'short grain': [
    { name: 'Sushi', description: 'Japanese dish of specially prepared vinegared rice, usually with some other ingredients, such as seafood, vegetables and occasionally tropical fruits.', imageHint: 'sushi assortment' },
    { name: 'Risotto', description: 'Creamy Italian rice dish cooked with broth until it reaches a creamy consistency.', imageHint: 'risotto dish' },
    { name: 'Paella', description: 'A Spanish rice dish originally from Valencia. Often made with short or medium grain rice.', imageHint: 'paella seafood' },
  ],
  'broken': [
    { name: 'Congee/Rice Porridge', description: 'A type of rice porridge or gruel popular in many Asian countries. Savory or sweet.', imageHint: 'rice congee' },
    { name: 'Rice Pudding', description: 'Sweet dessert made by simmering rice with milk or cream and sweeteners like sugar.', imageHint: 'rice pudding' },
    { name: 'Idli/Dosa Batter', description: 'Broken rice is often used in South Indian cuisine to make batters for fermented foods like idli and dosa.', imageHint: 'idli dosa' },
  ],
  'default': [
    { name: 'Steamed Rice', description: 'Simple and versatile, pairs with many dishes across various cuisines.', imageHint: 'steamed rice' }
  ]
};

export interface MedicineInfo {
  name: string;
  type: string; // e.g., Fungicide, Bactericide
  usage: string;
  precautions: string;
  imageHint: string;
}

export const medicineInfo: Record<string, MedicineInfo[]> = {
  'Bacterial Blight': [
    { name: 'Agri-Mycin 17 (Streptomycin Sulfate)', type: 'Bactericide', usage: 'Apply as a foliar spray at the first sign of disease. Repeat at 7-10 day intervals if conditions favor disease development.', precautions: 'Follow label instructions. Avoid spraying during bee activity. Protective gear recommended.', imageHint: 'farm spray' },
    { name: 'Kocide 3000 (Copper Hydroxide)', type: 'Bactericide/Fungicide', usage: 'Provides protective barrier against bacterial infection. Apply before disease onset or at very early stages.', precautions: 'Can be phytotoxic if overused or applied in hot, dry conditions. Check for copper sensitivity.', imageHint: 'copper solution' },
  ],
  'Sheath Rot': [
    { name: 'Tilt (Propiconazole)', type: 'Fungicide', usage: 'Systemic fungicide. Apply at late booting to early heading stage for best results.', precautions: 'Rotate with fungicides of different modes of action to prevent resistance. Adhere to pre-harvest intervals.', imageHint: 'chemical bottle' },
    { name: 'Score (Difenoconazole)', type: 'Fungicide', usage: 'Broad-spectrum fungicide effective against sheath rot complex. Apply preventatively or at early signs.', precautions: 'Ensure thorough coverage. Follow re-entry intervals specified on the label.', imageHint: 'fungicide powder' },
  ],
  'Brown Spot': [
     { name: 'Beam (Tricyclazole)', type: 'Fungicide', usage: 'Systemic fungicide, particularly effective against rice blast but can help manage brown spot.', precautions: 'Primarily for blast; consult local recommendations for brown spot efficacy.', imageHint: 'plant treatment' },
     { name: 'Nativo (Tebuconazole + Trifloxystrobin)', type: 'Fungicide', usage: 'Combination fungicide offering broad-spectrum control. Apply at tillering and booting stages.', precautions: 'Good for integrated disease management. Observe resistance management guidelines.', imageHint: 'garden care' }
  ],
  'default': [
    { name: 'Neem Oil Extract', type: 'Organic Biopesticide', usage: 'Broad-spectrum, can help deter pests and manage some fungal issues. Apply as a foliar spray.', precautions: 'Test on a small area first. Avoid spraying in direct sunlight or high temperatures.', imageHint: 'natural remedy' },
    { name: 'Trichoderma spp.', type: 'Biofungicide', usage: 'Soil or seed treatment to promote plant health and suppress soil-borne pathogens.', precautions: 'Store properly to maintain viability. Compatible with many organic practices.', imageHint: 'soil amendment' }
  ]
};

export function getCuisineIdeas(classification: string | undefined): CuisineIdea[] {
  if (!classification) return cuisineIdeas['default'];
  const ideas = cuisineIdeas[classification.toLowerCase()];
  return ideas || cuisineIdeas['default'];
}

export function getMedicineInfo(diseases: string[] | undefined): MedicineInfo[] {
  if (!diseases || diseases.length === 0) return medicineInfo['default'];
  
  const allMedicineInfo: MedicineInfo[] = [];
  const addedMedicineNames = new Set<string>();

  diseases.forEach(disease => {
    // Attempt to match common disease names
    const foundKey = Object.keys(medicineInfo).find(key => disease.toLowerCase().includes(key.toLowerCase()));
    const infoList = foundKey ? medicineInfo[foundKey] : [];
    
    infoList.forEach(info => {
      if (!addedMedicineNames.has(info.name)) {
        allMedicineInfo.push(info);
        addedMedicineNames.add(info.name);
      }
    });
  });

  return allMedicineInfo.length > 0 ? allMedicineInfo : medicineInfo['default'];
}
