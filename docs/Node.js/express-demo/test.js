function parseField(field) {
    return field
        .split(/\[|\]/)
        .filter((s) => s);
}
parseField('entry[title]')
console.log(parseField('entry[title]'))