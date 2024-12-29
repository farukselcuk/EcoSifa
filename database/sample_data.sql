-- Örnek bitkiler
INSERT INTO herbs (name, scientific_name, benefits, usage_instructions, image_path) VALUES
('Isırgan Otu', 'Urtica dioica', 'Kan temizleyici özelliği vardır. Bağışıklık sistemini güçlendirir.', 'Günde 2-3 fincan çay olarak tüketilebilir.', 'images/isirgan.jpg'),
('Papatya', 'Matricaria chamomilla', 'Sakinleştirici etkisi bulunur. Uykusuzluğa iyi gelir.', 'Yatmadan önce 1 fincan içilebilir.', 'images/papatya.jpg'),
('Adaçayı', 'Salvia officinalis', 'Boğaz ağrısına iyi gelir. Antiseptik özelliği vardır.', 'Günde 2 kez ılık olarak içilebilir.', 'images/adacayi.jpg');

-- Örnek hastalıklar
INSERT INTO diseases (name, description) VALUES
('Baş Ağrısı', 'Kronik veya akut baş ağrısı'),
('Öksürük', 'Kuru veya balgamlı öksürük'),
('Uykusuzluk', 'Uyku düzensizliği ve uykuya dalma zorluğu');

-- Örnek ilişkiler
INSERT INTO herb_disease_relations (herb_id, disease_id, treatment_description) VALUES
(1, 1, 'Isırgan otu çayı baş ağrısını hafifletmeye yardımcı olur.'),
(2, 3, 'Papatya çayı rahatlatıcı etkisiyle uykusuzluğa iyi gelir.'),
(3, 2, 'Adaçayı öksürük ve boğaz ağrısını hafifletir.'); 