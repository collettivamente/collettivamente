import React from 'react'
import { parseISO, format } from 'date-fns'
import { it } from 'date-fns/locale'

const Date: React.FC<{ dateString: string }> = ({ dateString }) => {
  const date = parseISO(dateString)
  return <time dateTime={dateString}>{format(date, 'dd MMM yyyy', { locale: it })}</time>
}

export default Date
