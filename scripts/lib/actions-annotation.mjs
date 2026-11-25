const escapeMessage = text => text.replaceAll('%', '%25').replaceAll('\r', '%0D').replaceAll('\n', '%0A')
const escapeProperty = text => escapeMessage(text).replaceAll(',', '%2C').replaceAll(':', '%3A')

export function warningAnnotation(file, title, message) {
  return `::warning file=${escapeProperty(file)},title=${escapeProperty(title)}::${escapeMessage(message)}`
}
