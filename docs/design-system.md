# Système de Design - Design Doc Automator

Ce document présente le système de design implémenté pour le projet Design Doc Automator. Il sert de référence pour l'utilisation cohérente des composants, des couleurs, de la typographie et des layouts dans l'application.

## Table des matières

1. [Fondations](#fondations)
   - [Couleurs](#couleurs)
   - [Typographie](#typographie)
   - [Espacement](#espacement)
2. [Composants de base](#composants-de-base)
   - [Button](#button)
   - [TextField](#textfield)
   - [Card](#card)
3. [Système de Layout](#système-de-layout)
   - [Grille responsive](#grille-responsive)
   - [Composants de layout](#composants-de-layout)
   - [Breakpoints](#breakpoints)
4. [Animations et transitions](#animations-et-transitions)
5. [Utilisation](#utilisation)

## Fondations

### Couleurs

Notre palette de couleurs est définie dans `frontend/src/theme/colors.js` et comprend :

- **Couleurs primaires** : Utilisées pour les éléments principaux de l'interface
- **Couleurs secondaires** : Pour les accents et les éléments secondaires
- **Couleurs neutres** : Pour le texte, les arrière-plans et les bordures
- **Couleurs de feedback** : Pour les messages de succès, d'erreur, d'avertissement et d'information

```javascript
// Exemple d'utilisation
import { colors } from '../theme';

// Utilisation dans un composant styled
const StyledComponent = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.text.primary,
}));
```

### Typographie

Notre système typographique est défini dans `frontend/src/theme/typography.js` et comprend :

- **Familles de polices** : Polices principales et alternatives
- **Échelle typographique** : Tailles de texte cohérentes pour différents niveaux de hiérarchie
- **Poids de police** : Regular, Medium, Bold pour différentes emphases
- **Styles prédéfinis** : Pour les titres, le corps du texte, les légendes, etc.

```javascript
// Exemple d'utilisation
import { Typography } from '@mui/material';

// Utilisation des variantes typographiques
<Typography variant="h1">Titre principal</Typography>
<Typography variant="body1">Texte de paragraphe</Typography>
```

### Espacement

Notre système d'espacement est défini dans `frontend/src/theme/spacing.js` et comprend :

- **Unité de base** : 8px, toutes les mesures d'espacement sont des multiples de cette unité
- **Échelle d'espacement** : space1 (8px) à space10 (80px)
- **Marges et paddings** : Valeurs prédéfinies pour les espacements intérieurs et extérieurs
- **Breakpoints** : Points de rupture pour le design responsive

```javascript
// Exemple d'utilisation
import { Box } from '@mui/material';

// Utilisation des espacements
<Box sx={{ p: 2, m: 3 }}>
  Contenu avec padding de 16px et margin de 24px
</Box>
```

## Composants de base

### Button

Le composant Button est défini dans `frontend/src/theme/components/Button.js` et offre :

- **Variantes** : Contained, Outlined, Text
- **Tailles** : Small, Medium, Large
- **États** : Default, Hover, Active, Disabled
- **Couleurs** : Primary, Secondary, Error, Success, Warning, Info

```javascript
// Exemple d'utilisation
import { Button } from '../theme/components';

<Button variant="contained" color="primary" size="large">
  Bouton principal
</Button>
```

### TextField

Le composant TextField est défini dans `frontend/src/theme/components/TextField.js` et offre :

- **Variantes** : Outlined, Filled, Standard
- **États** : Default, Focus, Error, Disabled
- **Types** : Text, Password, Number, Email, etc.
- **Validation** : Intégration avec les systèmes de validation

```javascript
// Exemple d'utilisation
import { TextField } from '../theme/components';

<TextField 
  label="Nom d'utilisateur" 
  variant="outlined" 
  error={!!errors.username}
  helperText={errors.username?.message}
/>
```

### Card

Le composant Card est défini dans `frontend/src/theme/components/Card.js` et offre :

- **Parties** : Header, Content, Media, Actions
- **Variantes** : Outlined, Elevated
- **Niveaux d'élévation** : De 0 à 24

```javascript
// Exemple d'utilisation
import { Card, CardHeader, CardContent, CardActions } from '../theme/components';

<Card>
  <CardHeader title="Titre de la carte" />
  <CardContent>
    Contenu de la carte
  </CardContent>
  <CardActions>
    <Button>Action</Button>
  </CardActions>
</Card>
```

## Système de Layout

### Grille responsive

Notre système de grille est défini dans `frontend/src/theme/components/Grid.js` et offre :

- **12 colonnes** : Division de l'écran en 12 colonnes pour un placement flexible
- **Responsive** : Adaptation automatique aux différentes tailles d'écran
- **Espacement configurable** : Contrôle de l'espacement entre les colonnes

```javascript
// Exemple d'utilisation
import { Container, Row, Col } from '../theme/components';

<Container>
  <Row spacing={2}>
    <Col xs={12} md={6} lg={4}>
      Colonne 1
    </Col>
    <Col xs={12} md={6} lg={4}>
      Colonne 2
    </Col>
    <Col xs={12} md={12} lg={4}>
      Colonne 3
    </Col>
  </Row>
</Container>
```

### Composants de layout

Nos composants de layout principaux sont :

#### Header

Défini dans `frontend/src/theme/components/Header.js` :

- **Position** : Fixed, Absolute, Sticky, Static, Relative
- **Élévation** : Contrôle de l'ombre portée
- **Actions** : Zones pour les actions à gauche et à droite
- **Responsive** : Adaptation aux écrans mobiles

```javascript
// Exemple d'utilisation
import { Header } from '../theme/components';

<Header 
  title="Design Doc Automator" 
  showMenuIcon 
  onMenuClick={handleSidebarToggle}
  rightActions={<IconButton color="inherit"><SettingsIcon /></IconButton>}
/>
```

#### Sidebar

Défini dans `frontend/src/theme/components/Sidebar.js` :

- **Variantes** : Permanent, Persistent, Temporary
- **Position** : Left, Right
- **États** : Open, Closed
- **Responsive** : Adaptation automatique aux écrans mobiles

```javascript
// Exemple d'utilisation
import { Sidebar } from '../theme/components';

<Sidebar
  variant="persistent"
  open={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
  items={navItems}
  activeItem="documents"
/>
```

#### ContentArea

Défini dans `frontend/src/theme/components/ContentArea.js` :

- **Adaptation automatique** : S'ajuste en fonction de la présence d'un Header et/ou d'une Sidebar
- **Padding configurable** : Contrôle de l'espacement intérieur
- **Responsive** : Adaptation aux différentes tailles d'écran

```javascript
// Exemple d'utilisation
import { ContentArea } from '../theme/components';

<ContentArea
  hasHeader
  hasSidebar
  sidebarOpen={sidebarOpen}
  sidebarWidth={240}
>
  Contenu principal
</ContentArea>
```

### Breakpoints

Nos breakpoints sont alignés avec Material-UI et définis comme suit :

- **xs** : 0px et plus (téléphones mobiles en mode portrait)
- **sm** : 600px et plus (téléphones mobiles en mode paysage)
- **md** : 960px et plus (tablettes)
- **lg** : 1280px et plus (ordinateurs portables et de bureau)
- **xl** : 1920px et plus (grands écrans)

```javascript
// Exemple d'utilisation dans un composant styled
const StyledComponent = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
  },
}));
```

## Animations et transitions

Nos animations et transitions sont définies dans `frontend/src/theme/utils/animations.js` et comprennent :

- **Durées** : Courte (150ms), Moyenne (300ms), Longue (500ms)
- **Courbes d'accélération** : Ease, Linear, EaseIn, EaseOut, EaseInOut
- **Animations prédéfinies** : Fade, Zoom, Slide, Rotate, Pulse, Shake, Bounce

```javascript
// Exemple d'utilisation
import { animations } from '../theme/utils';

// Utilisation dans un composant styled
const AnimatedComponent = styled('div')(({ theme }) => ({
  ...animations.fade.in,
  animationDuration: animations.durations.medium,
}));
```

## Utilisation

Pour utiliser le système de design dans votre application :

1. **Importez les composants nécessaires** :

```javascript
import { 
  Button, 
  TextField, 
  Card, 
  Container, 
  Row, 
  Col,
  Header,
  Sidebar,
  ContentArea
} from './theme/components';
```

2. **Utilisez le thème dans vos composants styled** :

```javascript
import { styled } from '@mui/material/styles';

const CustomComponent = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));
```

3. **Consultez le composant de démonstration** :

Pour voir un exemple complet d'utilisation du système de design, consultez le composant `LayoutDemo` dans `frontend/src/components/LayoutDemo.js` et accédez à la route `/layout-demo` dans l'application.

---

Ce système de design est conçu pour être extensible et adaptable aux besoins futurs du projet. N'hésitez pas à l'enrichir avec de nouveaux composants et styles au fur et à mesure que le projet évolue.
