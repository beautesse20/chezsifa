-- Carte et prix Chez Sifa (généré par scripts/gen-seed.mjs). Réexécutable : met à jour sans dupliquer.
begin;
insert into categories (id, fr, en, dfr, den, composable, sort) values ('grill', 'Grillades', 'Grills', 'Poulet, porc, bœuf, chèvre ou poisson, cuits au charbon ou au four, avec 1 accompagnement au choix.', 'Chicken, pork, beef, goat or fish, charcoal-grilled or oven-baked, with 1 side of your choice.', true, 1)
  on conflict (id) do update set fr = excluded.fr, en = excluded.en, dfr = excluded.dfr, den = excluded.den, composable = excluded.composable, sort = excluded.sort;
insert into categories (id, fr, en, dfr, den, composable, sort) values ('trad', 'Plats du pays', 'Traditional dishes', 'Pondu, ragoût de bœuf, makayabu, poulet à l''arachide… À accompagner de fufu, kwanga, riz ou plantain.', 'Cassava leaves, beef stew, makayabu, chicken in peanut sauce… Pair with fufu, kwanga, rice or plantain.', true, 2)
  on conflict (id) do update set fr = excluded.fr, en = excluded.en, dfr = excluded.dfr, den = excluded.den, composable = excluded.composable, sort = excluded.sort;
insert into categories (id, fr, en, dfr, den, composable, sort) values ('veg', 'Végétarien', 'Vegetarian', 'Plantain et haricots, riz et pois chiches.', 'Plantain and beans, rice and chickpeas.', true, 3)
  on conflict (id) do update set fr = excluded.fr, en = excluded.en, dfr = excluded.dfr, den = excluded.den, composable = excluded.composable, sort = excluded.sort;
insert into categories (id, fr, en, dfr, den, composable, sort) values ('sides', 'Accompagnements', 'Sides', 'Riz, féculents et accompagnements, en Regular ou Large.', 'Rice, starches and sides, Regular or Large.', false, 4)
  on conflict (id) do update set fr = excluded.fr, en = excluded.en, dfr = excluded.dfr, den = excluded.den, composable = excluded.composable, sort = excluded.sort;
insert into categories (id, fr, en, dfr, den, composable, sort) values ('starters', 'Entrées', 'Appetizers', 'Par lot de 5 pièces. Le prix par lot baisse dès 51 pièces.', 'Packs of 5 pieces. Lower price per pack from 51 pieces.', false, 5)
  on conflict (id) do update set fr = excluded.fr, en = excluded.en, dfr = excluded.dfr, den = excluded.den, composable = excluded.composable, sort = excluded.sort;
insert into categories (id, fr, en, dfr, den, composable, sort) values ('pasta', 'Pâtes & cuisine occidentale', 'Pasta & Western', 'Pâtes sauce bœuf, macaroni au fromage, lasagne.', 'Pasta with beef sauce, mac & cheese, lasagna.', true, 6)
  on conflict (id) do update set fr = excluded.fr, en = excluded.en, dfr = excluded.dfr, den = excluded.den, composable = excluded.composable, sort = excluded.sort;
insert into categories (id, fr, en, dfr, den, composable, sort) values ('salads', 'Salades', 'Salads', 'Fraîches, en Regular ou Large.', 'Fresh, Regular or Large.', false, 7)
  on conflict (id) do update set fr = excluded.fr, en = excluded.en, dfr = excluded.dfr, den = excluded.den, composable = excluded.composable, sort = excluded.sort;
insert into categories (id, fr, en, dfr, den, composable, sort) values ('kids', 'Menu enfants BBQ', 'Kids'' BBQ menu', 'Hot-dog ou hamburger avec frites, macaroni au fromage.', 'Hot dog or burger with fries, mac & cheese.', true, 8)
  on conflict (id) do update set fr = excluded.fr, en = excluded.en, dfr = excluded.dfr, den = excluded.den, composable = excluded.composable, sort = excluded.sort;
insert into categories (id, fr, en, dfr, den, composable, sort) values ('extras', 'Protéines supplémentaires', 'Extra proteins', 'À ajouter à n''importe quelle assiette.', 'Add to any plate.', false, 9)
  on conflict (id) do update set fr = excluded.fr, en = excluded.en, dfr = excluded.dfr, den = excluded.den, composable = excluded.composable, sort = excluded.sort;
insert into categories (id, fr, en, dfr, den, composable, sort) values ('cakes', 'Douceurs', 'Cakes', 'Gâteaux faits maison, vendus entiers (environ 6 pouces, 6 à 8 portions).', 'Homemade whole cakes (about 6 inches, 6 to 8 servings).', false, 10)
  on conflict (id) do update set fr = excluded.fr, en = excluded.en, dfr = excluded.dfr, den = excluded.den, composable = excluded.composable, sort = excluded.sort;
insert into categories (id, fr, en, dfr, den, composable, sort) values ('sauces', 'Marché Sifa', 'Sifa Market', 'Sauce tomate rôtie et marinades vertes maison, en 250 ml ou 500 ml.', 'Homemade roasted tomato sauce and green marinades, 250 ml or 500 ml.', false, 11)
  on conflict (id) do update set fr = excluded.fr, en = excluded.en, dfr = excluded.dfr, den = excluded.den, composable = excluded.composable, sort = excluded.sort;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('chicken1', 'grill', '1 morceau de poulet BBQ', '1 pc BBQ chicken', 'Mariné, cuit au charbon.', 'Marinated, charcoal-grilled.', 'rl', 17, 25, null, null, true, null, true, 0)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('wings', 'grill', 'Ailes de poulet BBQ', 'BBQ chicken wings', null, null, 'rl', 18, 25, null, null, true, null, false, 1)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('wholechicken', 'grill', 'Poulet entier BBQ', 'Whole BBQ chicken', null, null, 'rl', 55, 60, null, null, true, null, false, 2)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('ribs', 'grill', 'Côtes levées de porc', 'Pork ribs', null, null, 'rl', 15, 20, null, null, true, null, false, 3)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('chops', 'grill', 'Côtelettes de porc', 'Pork chops', null, null, 'rl', 15, 20, null, null, true, null, false, 4)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('skewers', 'grill', 'Brochettes de bœuf BBQ', 'BBQ beef skewers', null, null, 'rl', 15, 22, null, null, true, null, false, 5)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('goat', 'grill', 'Chèvre BBQ', 'BBQ goat meat', null, null, 'rl', 25, 30, null, null, true, null, false, 6)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('tilapia', 'grill', 'Tilapia BBQ', 'BBQ tilapia', null, null, 'rl', 15, 18, null, null, true, null, false, 7)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('mackerel', 'grill', 'Maquereau BBQ', 'BBQ mackerel', null, null, 'rl', 18, 24, null, null, true, null, false, 8)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('seabass', 'grill', 'Bar sauté', 'Sautéed sea bass', null, null, 'rl', 15, 20, null, null, true, null, false, 9)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('pondu', 'trad', 'Pondu (feuilles de manioc)', 'Pondu (cassava leaves)', 'La recette de la maison.', 'The house recipe.', 'rl', 15, 20, null, null, false, null, true, 10)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('beanstew', 'trad', 'Haricots en sauce', 'Bean stew', null, null, 'rl', 10, 15, null, null, false, null, false, 11)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('hardchicken', 'trad', 'Poulet dur (mature)', 'Mature (hard) chicken', 'Sauce tomate ou sauce arachide.', 'Tomato or peanut sauce.', 'rl', 16, 22, null, null, true, '[{"key":"sauce","fr":"Sauce","en":"Sauce","choices":[{"id":"tomato","fr":"Sauce tomate","en":"Tomato sauce"},{"id":"peanut","fr":"Sauce arachide","en":"Peanut sauce"}]}]'::jsonb, false, 12)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('beefstew', 'trad', 'Ragoût de bœuf', 'Beef stew', null, null, 'rl', 18, 25, null, null, false, null, false, 13)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('catfish', 'trad', 'Poisson-chat vapeur', 'Steamed catfish', null, null, 'rl', 13, 17, null, null, false, null, false, 14)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('makayabu', 'trad', 'Makayabu (morue salée)', 'Makayabu (salted cod)', 'Aux poivrons, aux oignons ou sauce d''aubergine.', 'With peppers, onions or eggplant sauce.', 'rl', 18, 25, null, null, false, '[{"key":"style","fr":"Préparation","en":"Style","choices":[{"id":"pepper","fr":"Aux poivrons","en":"With peppers"},{"id":"onion","fr":"Aux oignons","en":"With onions"},{"id":"eggplant","fr":"Sauce d''aubergine","en":"Eggplant sauce"}]}]'::jsonb, true, 15)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('plantainbeans', 'veg', 'Plantain frit + haricots sauce tomate', 'Fried plantain + beans in tomato sauce', null, null, 'rl', 17, 22, null, null, false, null, false, 16)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('ricechick', 'veg', 'Riz + pois chiches', 'Rice + chickpeas', null, null, 'rl', 15, 20, null, null, false, '[{"key":"rice","fr":"Riz","en":"Rice","choices":[{"id":"white","fr":"Riz blanc","en":"White rice"},{"id":"fried","fr":"Riz frit","en":"Fried rice"}]},{"key":"chickpeas","fr":"Pois chiches","en":"Chickpeas","choices":[{"id":"coco","fr":"Au lait de coco","en":"With coconut milk"},{"id":"tomato","fr":"Sauce tomate","en":"Tomato sauce"}]}]'::jsonb, false, 17)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('alloco', 'sides', 'Plantain frit / alloco', 'Fried plantain / alloco', null, null, 'rl', 7, 13, null, null, false, null, false, 18)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('friedveg', 'sides', 'Riz frit aux légumes', 'Fried rice with vegetables', 'Carotte et petits pois.', 'Carrot and green peas.', 'rl', 9, 15, null, null, false, null, false, 19)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('friedplain', 'sides', 'Riz frit sans légumes', 'Fried rice, no vegetables', null, null, 'rl', 8, 15, null, null, false, null, false, 20)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('whiterice', 'sides', 'Riz blanc vapeur', 'White steamed rice', null, null, 'rl', 6, 11, null, null, false, null, false, 21)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('fries', 'sides', 'Frites', 'Fries', null, null, 'rl', 5, 8, null, null, false, null, false, 22)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('jollof', 'sides', 'Riz jollof', 'Jollof rice', null, null, 'rl', 10, 15, null, null, false, null, false, 23)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('pilau', 'sides', 'Riz pilau', 'Pilau rice', null, null, 'rl', 10, 13.5, null, null, false, null, false, 24)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('plantainsteam', 'sides', 'Plantain vapeur', 'Steamed plantain', null, null, 'rl', 6, 10.5, null, null, false, null, false, 25)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('cassava', 'sides', 'Manioc bouilli', 'Boiled cassava', null, null, 'rl', 5, 9, null, null, false, null, false, 26)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('fufu', 'sides', 'Fufu (ugali)', 'Fufu (ugali)', null, null, 'rl', 5, 8, '7–8 $', '$7–8', false, null, false, 27)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('kwanga', 'sides', 'Kwanga / chikwangue', 'Kwanga / chikwangue', 'Bâtonnets de manioc.', 'Cassava sticks.', 'rl', 10, 20, null, null, false, null, false, 28)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('potatoes', 'sides', 'Pommes de terre sautées', 'Sautéed potatoes', null, null, 'rl', 7, 13, null, null, false, null, false, 29)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('mikate', 'starters', 'Mikate (beignets africains)', 'Mikate (African donuts)', null, null, 'pack', 4, 3, null, null, false, null, false, 30)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('mandazi', 'starters', 'Mandazi', 'Mandazi', null, null, 'pack', 5, 4, null, null, false, null, false, 31)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('samosabeef', 'starters', 'Samoussas au bœuf', 'Beef samosas', null, null, 'pack', 8, 7, null, null, false, null, false, 32)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('samosaveg', 'starters', 'Samoussas végé', 'Veggie samosas', null, null, 'pack', 5, 4, null, null, false, null, false, 33)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('rollbeef', 'starters', 'Rouleaux de printemps au bœuf', 'Beef spring rolls', null, null, 'pack', 5, 4, null, null, false, null, false, 34)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('rollveg', 'starters', 'Rouleaux de printemps végé', 'Veggie spring rolls', null, null, 'pack', 4, 3, null, null, false, null, false, 35)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('pastabeef', 'pasta', 'Pâtes + sauce tomate maison au bœuf', 'Pasta + homemade beef tomato sauce', null, null, 'rl', 13, 18, null, null, false, null, false, 36)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('mac', 'pasta', 'Macaroni au fromage', 'Mac & cheese', null, null, 'rl', 15, 18, null, null, false, null, false, 37)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('lasagna', 'pasta', 'Lasagne viande et légumes', 'Meat & vegetable lasagna', null, null, 'rl', 15, 18, null, null, false, null, false, 38)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('green', 'salads', 'Salade verte fraîche', 'Fresh green salad', null, null, 'rl', 7, 10, null, null, false, null, false, 39)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('slaw', 'salads', 'Salade de chou et carottes', 'Cabbage & carrot salad', null, null, 'rl', 6, 9, null, null, false, null, false, 40)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('hotdog', 'kids', 'Hot-dog BBQ + frites', 'BBQ hot dog + fries', null, null, 'single', 8, null, null, null, false, null, false, 41)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('burger', 'kids', 'Hamburger BBQ + frites', 'BBQ hamburger + fries', null, null, 'single', 15, null, null, null, false, null, false, 42)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('kidsmac', 'kids', 'Macaroni au fromage (portion enfant)', 'Mac & cheese (kids'' portion)', null, null, 'single', 10, null, null, null, false, null, false, 43)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('xchicken', 'extras', 'Morceau de poulet', 'Chicken piece', null, null, 'single', 8, null, null, null, false, null, false, 44)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('xrib', 'extras', 'Côte levée de porc', 'Pork rib', null, null, 'single', 7, null, null, null, false, null, false, 45)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('xchop', 'extras', 'Côtelette de porc', 'Pork chop', null, null, 'single', 8, null, null, null, false, null, false, 46)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('xtilapia', 'extras', 'Tilapia', 'Tilapia', null, null, 'single', 7, null, null, null, false, null, false, 47)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('xmackerel', 'extras', 'Maquereau', 'Mackerel', null, null, 'single', 10, null, null, null, false, null, false, 48)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('xseabass', 'extras', 'Filet de bar sauté', 'Sautéed sea bass fillet', null, null, 'single', 10, null, null, null, false, null, false, 49)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('xskewer', 'extras', 'Brochette de bœuf', 'Beef skewer', null, null, 'single', 10, null, null, null, false, null, false, 50)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('xgoat', 'extras', 'Portion de chèvre', 'Goat meat portion', null, null, 'single', 15, null, null, null, false, null, false, 51)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('choco', 'cakes', 'Gâteau au chocolat', 'Chocolate cake', null, null, 'single', 30, null, null, null, false, null, false, 52)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('forest', 'cakes', 'Forêt-noire', 'Black forest', null, null, 'single', 42, null, null, null, false, null, false, 53)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('straw', 'cakes', 'Gâteau aux fraises', 'Strawberry cake', null, null, 'single', 40, null, null, null, false, null, false, 54)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('cheese', 'cakes', 'Gâteau au fromage', 'Cheesecake', null, null, 'single', 45, null, null, null, false, null, false, 55)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('cheesestraw', 'cakes', 'Gâteau au fromage, nappage fraises', 'Cheesecake with strawberry topping', null, null, 'single', 50, null, null, null, false, null, true, 56)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('tomato', 'sauces', 'Sauce tomate rôtie (tout usage)', 'Roasted tomato sauce (all purpose)', null, null, 'ml', 8, 15, null, null, false, null, false, 57)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('greenmeat', 'sauces', 'Marinade verte poulet & viandes', 'Green marinade (chicken & meat)', null, null, 'ml', 8, 15, null, null, false, null, false, 58)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('greenfish', 'sauces', 'Marinade verte citronnée poisson & fruits de mer', 'Lemon green marinade (fish & seafood)', null, null, 'ml', 7, 14, null, null, false, null, false, 59)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('greendijon', 'sauces', 'Marinade verte citron & Dijon', 'Lemon & Dijon green marinade', null, null, 'ml', 8, 15, null, null, false, null, false, 60)
  on conflict (id) do nothing;
insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values ('tomatogreen', 'sauces', 'Sauce tomate rôtie & marinade verte (tout usage)', 'Roasted tomato & green marinade (all purpose)', null, null, 'ml', 7, 13, null, null, false, null, false, 61)
  on conflict (id) do nothing;
insert into promos (code, type, value, scope, min_total) values ('MASEMAINE', 'percent', 10, 'weekly', null) on conflict (code) do nothing;
insert into promos (code, type, value, scope, min_total) values ('BIENVENUE', 'fixed', 5, 'first', 40) on conflict (code) do nothing;
insert into settings (id) values (1) on conflict (id) do nothing;
commit;
