update products set rentable = true,
  rental_price = round(price * 0.25, 2),
  rental_duration_days = 3,
  rental_deposit = round(price * 0.5, 2)
where id in (
  '4c756662-87fe-4b94-a727-627377030454',
  '9efb2c1c-dac6-435a-9709-cbb8f54fa2a5',
  '7354e326-3f4e-46e1-985f-93ef182ed323',
  'ff616a1d-d037-474f-8583-99d37b2cd128',
  '02145713-d7d6-45bb-acf7-b176a619e413',
  '722a9952-e015-42c4-a13f-81177b594180',
  '5a8e6d43-f46f-497a-846f-358234681d21',
  'ccec2a95-bc02-4b08-b91d-7c81d6809474',
  'd30a4656-9dc2-4ec9-b6c0-6746681e3b43',
  '9e5a0f60-6990-4581-a7ca-77798ea208ff',
  'cc7a7d49-b414-408e-aa35-11a82709e8e1',
  '2aa43f29-878c-4c76-baf1-419feb3e01d1',
  '8740aa71-b6e6-4d8b-b59c-e6b5c83549e2',
  'd1b07571-7944-4074-8cc4-218cdcf20716',
  '10f042f2-4913-4c67-8cc5-966f22e4127b'
);