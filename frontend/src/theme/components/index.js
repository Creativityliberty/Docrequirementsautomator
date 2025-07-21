/**
 * Point d'entrée pour tous les composants du système de design
 * Facilite l'importation des composants dans l'application
 */

import Button from './Button';
import TextField from './TextField';
import { Card, CardHeader, CardContent, CardActions, CardMedia } from './Card';
import { Container, Row, Col } from './Grid';
import Sidebar from './Sidebar';
import Header from './Header';
import ContentArea from './ContentArea';

export {
  Button,
  TextField,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CardMedia,
  Container,
  Row,
  Col,
  Sidebar,
  Header,
  ContentArea
};

// Exporter tous les composants par défaut
const components = {
  Button,
  TextField,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CardMedia,
  Container,
  Row,
  Col,
  Sidebar,
  Header,
  ContentArea
};

export default components;
