import React, { useState, useRef } from 'react';
import { Gift, Clock, Users, TrendingUp, FileText, Heart, ChevronLeft, ChevronRight, Plus, X, Edit2, Download, Eye, Check } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

interface CampaignCard {
  id: number;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  backgroundColor: string;
  features: string[];
  icon: string;
}

interface EditorProps {
  card: CampaignCard | null;
  onClose: () => void;
  onSave: (card: CampaignCard) => void;
  isNew?: boolean;
}

interface PreviewProps {
  cards: CampaignCard[];
  onClose: () => void;
}

const CARDS_PER_PAGE = 6;

const colorOptions = [
  { label: "Pembe-Turuncu", value: "from-pink-500 to-orange-500" },
  { label: "Yeşil", value: "from-emerald-500 to-teal-500" },
  { label: "Mor", value: "from-purple-500 to-indigo-500" },
  { label: "Mavi", value: "from-blue-500 to-cyan-500" },
  { label: "Kırmızı", value: "from-red-500 to-pink-500" },
];

const iconOptions = [
  { label: "Hediye", value: "gift" },
  { label: "Trend", value: "trending-up" },
  { label: "Kalp", value: "heart" },
];

function MultiCardPreview({ cards, onClose }: PreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    try {
      const container = containerRef.current;
      if (container) {
        // Tüm kartları tek bir görüntüde indir
        const dataUrl = await htmlToImage.toPng(container, {
          quality: 1.0,
          pixelRatio: 3,
          backgroundColor: '#000'
        });
        
        const link = document.createElement('a');
        link.download = 'kampanyalar.png';
        link.href = dataUrl;
        link.click();
      }
    } catch (error) {
      console.error('Görsel indirme hatası:', error);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'gift':
        return <Gift className="w-6 h-6" />;
      case 'trending-up':
        return <TrendingUp className="w-6 h-6" />;
      case 'heart':
        return <Heart className="w-6 h-6" />;
      default:
        return <Gift className="w-6 h-6" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 overflow-y-auto z-50">
      <div className="sticky top-2 flex justify-end gap-2 z-10 px-2">
        <button
          onClick={handleDownload}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <Download className="w-5 h-5" />
        </button>
        <button
          onClick={onClose}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div 
        ref={containerRef}
        className="flex flex-col items-center gap-3 p-4 bg-black"
      >
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`w-full max-w-[350px] rounded-3xl p-4 bg-gradient-to-r ${card.backgroundColor}`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-white/20 rounded-full">
                {getIcon(card.icon)}
              </div>
              <div>
                <h2 className="font-bold text-lg">{card.title}</h2>
                <p className="text-sm text-white/80">{card.description}</p>
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-bold">{card.price.toLocaleString('tr-TR')} TL</span>
              {card.originalPrice && (
                <span className="text-white/60 line-through text-sm">
                  {card.originalPrice.toLocaleString('tr-TR')} TL
                </span>
              )}
            </div>

            {card.features.length > 0 && (
              <div className="space-y-2">
                {card.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CardEditor({ card, onClose, onSave, isNew = false }: EditorProps) {
  const [editedCard, setEditedCard] = useState<CampaignCard>(
    card || {
      id: Date.now(),
      title: "",
      description: "",
      price: 0,
      backgroundColor: colorOptions[0].value,
      features: [""],
      icon: "gift"
    }
  );

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...editedCard.features];
    newFeatures[index] = value;
    setEditedCard({ ...editedCard, features: newFeatures });
  };

  const addFeature = () => {
    setEditedCard({ ...editedCard, features: [...editedCard.features, ""] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = editedCard.features.filter((_, i) => i !== index);
    setEditedCard({ ...editedCard, features: newFeatures });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full mt-2">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{isNew ? "Yeni Kampanya" : "Kampanyayı Düzenle"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Başlık</label>
            <input
              type="text"
              value={editedCard.title}
              onChange={(e) => setEditedCard({ ...editedCard, title: e.target.value })}
              className="w-full bg-gray-700 rounded-lg p-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Açıklama</label>
            <input
              type="text"
              value={editedCard.description}
              onChange={(e) => setEditedCard({ ...editedCard, description: e.target.value })}
              className="w-full bg-gray-700 rounded-lg p-2 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fiyat (TL)</label>
              <input
                type="number"
                value={editedCard.price}
                onChange={(e) => setEditedCard({ ...editedCard, price: Number(e.target.value) })}
                className="w-full bg-gray-700 rounded-lg p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">İndirimli Fiyat (TL)</label>
              <input
                type="number"
                value={editedCard.originalPrice || ""}
                onChange={(e) => setEditedCard({ ...editedCard, originalPrice: Number(e.target.value) || undefined })}
                className="w-full bg-gray-700 rounded-lg p-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Renk</label>
            <select
              value={editedCard.backgroundColor}
              onChange={(e) => setEditedCard({ ...editedCard, backgroundColor: e.target.value })}
              className="w-full bg-gray-700 rounded-lg p-2 text-white"
            >
              {colorOptions.map((color) => (
                <option key={color.value} value={color.value}>
                  {color.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">İkon</label>
            <select
              value={editedCard.icon}
              onChange={(e) => setEditedCard({ ...editedCard, icon: e.target.value })}
              className="w-full bg-gray-700 rounded-lg p-2 text-white"
            >
              {iconOptions.map((icon) => (
                <option key={icon.value} value={icon.value}>
                  {icon.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Özellikler</label>
            {editedCard.features.map((feature, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="flex-1 bg-gray-700 rounded-lg p-2 text-white"
                />
                <button
                  onClick={() => removeFeature(index)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addFeature}
              className="w-full p-2 bg-gray-700 hover:bg-gray-600 rounded-lg mt-2 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Özellik Ekle</span>
            </button>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={onClose}
              className="flex-1 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              İptal
            </button>
            <button
              onClick={() => onSave(editedCard)}
              className="flex-1 p-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
            >
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [cards, setCards] = useState<CampaignCard[]>([
    {
      id: 1,
      title: "Şubat Özel Kampanya",
      description: "30-40K Takipçi + 30 Görsel Beğeni",
      price: 3500,
      originalPrice: 5000,
      backgroundColor: "from-pink-500 to-orange-500",
      features: ["Keşfet Garantili", "Elit Kitle", "Tüm Hediyeler"],
      icon: "gift"
    },
    {
      id: 2,
      title: "Reels Keşfet Paketi",
      description: "5K Reels İzlenme",
      price: 700,
      backgroundColor: "from-emerald-500 to-teal-500",
      features: ["Organik Artış", "Gerçek İzleyiciler", "Hızlı Teslimat"],
      icon: "trending-up"
    },
    {
      id: 3,
      title: "Aylık Beğeni Paketi",
      description: "30 Gün Beğeni Garantisi",
      price: 2350,
      backgroundColor: "from-purple-500 to-indigo-500",
      features: ["5 Görsele Beğeni", "Düzenli Rapor"],
      icon: "heart"
    }
  ]);

  const [editingCard, setEditingCard] = useState<CampaignCard | null>(null);
  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set());
  const [isCreating, setIsCreating] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(cards.length / CARDS_PER_PAGE);
  const currentCards = cards.slice(
    currentPage * CARDS_PER_PAGE,
    (currentPage + 1) * CARDS_PER_PAGE
  );

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'gift':
        return <Gift className="w-6 h-6" />;
      case 'trending-up':
        return <TrendingUp className="w-6 h-6" />;
      case 'heart':
        return <Heart className="w-6 h-6" />;
      default:
        return <Gift className="w-6 h-6" />;
    }
  };

  const handleSave = (card: CampaignCard) => {
    if (editingCard) {
      setCards(cards.map((c) => (c.id === card.id ? card : c)));
    } else {
      setCards([...cards, card]);
    }
    setEditingCard(null);
    setIsCreating(false);
  };

  const toggleCardSelection = (cardId: number) => {
    const newSelection = new Set(selectedCards);
    if (newSelection.has(cardId)) {
      newSelection.delete(cardId);
    } else {
      newSelection.add(cardId);
    }
    setSelectedCards(newSelection);
  };

  const handlePreview = () => {
    if (selectedCards.size > 0) {
      const selectedCardObjects = cards.filter(card => selectedCards.has(card.id));
      setPreviewCards(selectedCardObjects);
    }
  };

  const [previewCards, setPreviewCards] = useState<CampaignCard[]>([]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="p-2 hover:bg-gray-800 rounded-full disabled:opacity-50"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-red-500" />
              <h1 className="text-2xl font-bold">Özel Kampanyalar</h1>
            </div>
            {selectedCards.size > 0 && (
              <button
                onClick={handlePreview}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                <span>{selectedCards.size} Kartı Önizle</span>
              </button>
            )}
          </div>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
            className="p-2 hover:bg-gray-800 rounded-full disabled:opacity-50"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {currentCards.map((card) => (
            <div
              key={card.id}
              className={`rounded-3xl p-6 bg-gradient-to-r ${card.backgroundColor} transform hover:scale-105 transition-transform duration-200 relative group`}
            >
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => toggleCardSelection(card.id)}
                  className={`p-2 rounded-full transition-colors ${
                    selectedCards.has(card.id)
                      ? 'bg-white text-black'
                      : 'bg-white/20 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setEditingCard(card)}
                  className="p-2 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 rounded-full">
                  {getIcon(card.icon)}
                </div>
                <div>
                  <h2 className="font-bold text-xl">{card.title}</h2>
                  <p className="text-sm text-white/80">{card.description}</p>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-bold">{card.price.toLocaleString('tr-TR')} TL</span>
                {card.originalPrice && (
                  <span className="text-white/60 line-through">
                    {card.originalPrice.toLocaleString('tr-TR')} TL
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {card.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={() => setIsCreating(true)}
            className="rounded-3xl p-6 border-2 border-dashed border-gray-700 hover:border-gray-500 flex items-center justify-center transition-colors h-full min-h-[300px]"
          >
            <div className="flex flex-col items-center gap-2 text-gray-500 hover:text-gray-400">
              <Plus className="w-8 h-8" />
              <span className="font-medium">Yeni Kampanya Ekle</span>
            </div>
          </button>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentPage === i ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {(editingCard || isCreating) && (
        <CardEditor
          card={editingCard}
          onClose={() => {
            setEditingCard(null);
            setIsCreating(false);
          }}
          onSave={handleSave}
          isNew={isCreating}
        />
      )}

      {previewCards.length > 0 && (
        <MultiCardPreview
          cards={previewCards}
          onClose={() => {
            setPreviewCards([]);
            setSelectedCards(new Set());
          }}
        />
      )}
    </div>
  );
}

export default App;