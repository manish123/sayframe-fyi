"use client";
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';

const FONT_FAMILIES = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Courier New',
  'Georgia',
  'Verdana',
  'Impact',
  'Roboto',
  'Lato',
  'Montserrat',
  'Oswald',
  'Open Sans',
  'Poppins',
  'Raleway',
  'Merriweather',
  'PT Sans',
  'Source Sans Pro',
  'Playfair Display',
  'Bebas Neue',
  'Nunito',
  'Pacifico',
  'Dancing Script',
  'Indie Flower',
  'Bangers',
  'Caveat'
];

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 64, 72];

export const TextControls = ({ canvasRef }) => {
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState(28);
  const [fontWeight, setFontWeight] = useState('normal');
  const [fontStyle, setFontStyle] = useState('normal');
  const [textAlign, setTextAlign] = useState('center');
  const [textColor, setTextColor] = useState('#000000');

  // Track selected text object from FabricCanvas
  const [selectedText, setSelectedText] = useState(null);

  useEffect(() => {
    if (canvasRef && canvasRef.current && canvasRef.current.getSelectedText) {
      const obj = canvasRef.current.getSelectedText();
      if (obj) {
        setFontFamily(obj.fontFamily || 'Arial');
        setFontSize(obj.fontSize || 28);
        setTextColor(obj.fill || '#000000');
        setFontWeight(obj.fontWeight || 'normal');
        setFontStyle(obj.fontStyle || 'normal');
        setTextAlign(obj.textAlign || 'center');
        setSelectedText(obj);
      } else {
        setSelectedText(null);
      }
    }
  }, [canvasRef]); // Simplified dependency to avoid the complex expression warning

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', bgcolor: '#f1f5fd', borderRadius: 2, p: 2, boxShadow: '0 1px 4px rgba(60,60,120,0.04)' }}>

      <TextField select label="Font" value={fontFamily} onChange={e => { setFontFamily(e.target.value); updateText({ fontFamily: e.target.value }); }} size="small" sx={{ minWidth: 120 }} disabled={!selectedText}>
        {FONT_FAMILIES.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
      </TextField>
      <TextField select label="Size" value={fontSize} onChange={e => { setFontSize(Number(e.target.value)); updateText({ fontSize: Number(e.target.value) }); }} size="small" sx={{ minWidth: 75 }} disabled={!selectedText}>
        {FONT_SIZES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
      </TextField>
      <TextField type="color" label="Color" value={textColor} onChange={e => { setTextColor(e.target.value); updateText({ fill: e.target.value }); }} size="small" sx={{ minWidth: 60 }} inputProps={{ style: { padding: 2 } }} disabled={!selectedText} />
      <ToggleButtonGroup exclusive value={fontWeight} onChange={(_, v) => { setFontWeight(v); updateText({ fontWeight: v }); }} size="small" disabled={!selectedText}>
        <ToggleButton value="normal" aria-label="normal">N</ToggleButton>
        <ToggleButton value="bold" aria-label="bold"><b>B</b></ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup exclusive value={fontStyle} onChange={(_, v) => { setFontStyle(v); updateText({ fontStyle: v }); }} size="small" disabled={!selectedText}>
        <ToggleButton value="normal" aria-label="normal">N</ToggleButton>
        <ToggleButton value="italic" aria-label="italic"><i>I</i></ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup exclusive value={textAlign} onChange={(_, v) => { if (v) { setTextAlign(v); updateText({ textAlign: v }); } }} size="small" disabled={!selectedText}>
        <ToggleButton value="left" aria-label="left">L</ToggleButton>
        <ToggleButton value="center" aria-label="center">C</ToggleButton>
        <ToggleButton value="right" aria-label="right">R</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );

  function updateText(options) {
    if (canvasRef && canvasRef.current && canvasRef.current.updateText) {
      canvasRef.current.updateText(options);
    }
  }
};
