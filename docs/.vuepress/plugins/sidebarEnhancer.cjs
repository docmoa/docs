export default {
  name: 'sidebar-enhancer',

  async extendsPageOptions(extendable, app) {
    const filePathRelative = extendable.filePathRelative;

    if (!filePathRelative) return;

    console.log(filePathRelative)
    const match = filePathRelative.match(/^(\d{2}-)(.*)\.md$/);
    if (match) {
      
      // const title = match[2].replace(/-/g, ' '); // '-'를 공백으로 대체
      const title = match.slice(3)
      extendable.title = title.charAt(0).toUpperCase() + title.slice(1) // 첫 글자를 대문자로 변환
    }
  }
}
