export const calculatePercentDifference = (start: number, final: number) => {
   return (((final - start) / start) * 100).toFixed(2)
}

export const currencyFormatter = (amount: number | null) =>
   new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
   }).format(amount ?? 0)

const URL_REGEX =
   /^(?:(https?:\/\/)?(?:www\.)?)?([\w-]+(\.[\w-]+)+\/?)([^\s]*)$/

export const isURL = (input: string) => URL_REGEX.test(input)

export const getFileExtension = (fileName: string) => {
   const extensionRegex = /\.([0-9a-z]+)$/i
   const match = fileName.match(extensionRegex)

   return match ? match[1].toLowerCase() : null
}
