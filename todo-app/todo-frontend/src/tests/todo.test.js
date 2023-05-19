import React from 'react'
import { render, screen } from '@testing-library/react'
import Todo from '../Todos/Todo'

describe('Todo component', () => {
  test('renders todo text', () => {
    const todo = { text: 'Test todo', done: false }
    render(<Todo todo={todo} deleteTodo={() => {}} completeTodo={() => {}} />)

    const todoText = screen.getByText('Test todo')
    expect(todoText).toBeInTheDocument()
  })
})
