import React from 'react'

const Filter = ({ text, filter, onChange }) => (
  <form>
    <div>
      {text}
      <input value={filter} onChange={onChange} />
    </div>
  </form>
)

export default Filter
