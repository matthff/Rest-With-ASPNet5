import React, {useState, useEffect} from 'react';
import { FiArrowLeft, FiPower, FiEdit, FiTrash2 } from 'react-icons/fi'
import { Link, useHistory } from 'react-router-dom';

import api from '../../services/api';

import './styles.css';

import logoImage from '../../assets/logo.svg';

export default function Book(){

    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);

    const userName = localStorage.getItem('userName');
    const accessToken = localStorage.getItem('accessToken');

    const history = useHistory();

    const authorization = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    useEffect(() => {
        fetchMoreBooks();
    }, [accessToken]);

    async function fetchMoreBooks() {
        const response = await api.get(`api/Book/v1/asc/4/${page}`, authorization);
        setBooks([ ...books, ...response.data.list]);
        setPage(page + 1);
    }

    async function logout(){
        try {
            await api.get('api/auth/v1/revoke', authorization);

            localStorage.clear();
            history.push('/')
        } catch(error) {
            alert('Logout failed! Try Again!')
        }
    }

    async function editBook(id){
        try {
            history.push(`book/new/${id}`);
        } catch (error) {
            alert('Edit book failed! Try Again!');
        }
    }

    async function deleteBook(id) {
        try {
            await api.delete(`api/book/v1/${id}`, authorization)
            
            setBooks(books.filter(book => book.id !== id))
        } catch (error) {
            alert('Error deleting Book! Try Again!')
        }
    }


    return (
        <div className="book-container">
            <header>
                <img src={logoImage} alt="Erudio"/>
                <span>Welcome, <strong>{userName.toLowerCase()}</strong>!</span>
                <Link className="back-link" to="/selector">
                        <FiArrowLeft size={16} color="#251fc5"/>
                        Back to Selector
                </Link>
                <Link className="button" to="book/new/0">Add New Book</Link>
                <button onClick={logout} type="button">
                    <FiPower size={18} color="#251FC5" />
                </button>
            </header>

            <h1>Registered Books</h1>

            <ul>
                {books.map(book => (
                    <li key={book.id}>
                        <strong>Title:</strong>
                        <p>{book.title}</p>
                        <strong>Author:</strong>
                        <p>{book.author}</p>
                        <strong>Price:</strong>
                        <p>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(book.price)}</p>
                        <strong>Release Date:</strong>
                        <p>{Intl.DateTimeFormat('pt-BR').format(new Date(book.launchDate))}</p>

                        <button onClick={() => editBook(book.id)} type="button">
                            <FiEdit size={20} color="#251FC5"/>
                        </button>

                        <button onClick={() => deleteBook(book.id)} type="button">
                            <FiTrash2 size={20} color="#251FC5"/>
                        </button>
                    </li>
                ))}
            </ul>
            <button className="button" onClick={fetchMoreBooks} type="button">Load More</button>
        </div>
    );
}