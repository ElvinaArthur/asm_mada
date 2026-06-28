import mammoth from 'mammoth';

const files = [
  ['100 penseurs', 'C:\\Users\\Rasoa\\Desktop\\Boky hatsofoka anaty drive pour site ASM\\100 penseurs de la societe\\Synopsis.docx'],
  ['Histoire', 'C:\\Users\\Rasoa\\Desktop\\Boky hatsofoka anaty drive pour site ASM\\Histoire des pensées sociologiques\\Synopsis.docx'],
  ['Nouveau manuel', 'C:\\Users\\Rasoa\\Desktop\\Boky hatsofoka anaty drive pour site ASM\\Nouveau manuel de sociologie\\Synopsis.docx'],
];

for (const [name, file] of files) {
  const r = await mammoth.extractRawText({ path: file });
  console.log('=== ' + name + ' ===');
  console.log(JSON.stringify(r.value.slice(0, 600)));
  console.log();
}
