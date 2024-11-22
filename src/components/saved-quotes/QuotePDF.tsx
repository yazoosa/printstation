import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';
import type { SavedQuote } from '../../types/quote.types';

interface QuotePDFProps {
  quote: SavedQuote;
}

// Register custom fonts
Font.register({
  family: 'Open Sans',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 600 },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-700.ttf', fontWeight: 700 },
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 9,
    fontFamily: 'Open Sans',
    color: '#2b2d42',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    borderBottom: '1pt solid #1a5f7a',
    paddingBottom: 10,
  },
  logo: {
    width: 120,
  },
  title: {
    textAlign: 'right',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 700,
    color: '#1a5f7a',
    marginBottom: 4,
  },
  quoteRef: {
    fontSize: 10,
    color: '#457b9d',
    fontWeight: 600,
  },
  quoteDate: {
    fontSize: 9,
    color: '#6c757d',
    marginTop: 2,
  },
  addresses: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  addressBlock: {
    width: '48%',
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 3,
  },
  addressTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: '#1a5f7a',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  addressText: {
    marginBottom: 2,
    fontSize: 9,
    lineHeight: 1.3,
  },
  companyName: {
    fontWeight: 600,
    fontSize: 10,
    marginBottom: 3,
  },
  table: {
    marginTop: 10,
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1a5f7a',
    padding: 6,
    color: 'white',
    fontWeight: 600,
    fontSize: 9,
    marginBottom: 1,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    padding: 6,
    backgroundColor: '#f8f9fa',
    marginBottom: 1,
  },
  descriptionCol: {
    width: '60%',
  },
  descriptionText: {
    fontSize: 9,
    lineHeight: 1.3,
  },
  quantityCol: {
    width: '20%',
  },
  totalCol: {
    width: '20%',
    textAlign: 'right',
  },
  totalsSection: {
    alignSelf: 'flex-end',
    width: '35%',
    marginTop: 10,
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 3,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
    fontSize: 9,
  },
  totalLabel: {
    color: '#6c757d',
  },
  totalValue: {
    fontWeight: 600,
  },
  discountValue: {
    fontWeight: 600,
    color: '#dc2626',
  },
  grandTotal: {
    borderTopWidth: 1,
    borderTopColor: '#1a5f7a',
    marginTop: 4,
    paddingTop: 4,
  },
  grandTotalLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: '#1a5f7a',
  },
  grandTotalValue: {
    fontSize: 10,
    fontWeight: 700,
    color: '#1a5f7a',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    textAlign: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
    color: '#6c757d',
    fontSize: 7,
  },
});

export function QuotePDF({ quote }: QuotePDFProps) {
  const formatCurrency = (amount: number) => 
    `R${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

  const formatDescription = (description: string) => {
    const lines = description.split('\n')
      .filter(line => 
        !line.includes('Subtotal:') && 
        !line.includes('VAT:') && 
        !line.includes('Total:') && 
        !line.includes('Setup Fee:') && 
        !line.includes('Price:')
      );

    // Filter out empty finishing options section
    const finishingOptionsIndex = lines.findIndex(line => line === 'Finishing Options:');
    if (finishingOptionsIndex !== -1) {
      const nextLines = lines.slice(finishingOptionsIndex + 1);
      const hasValidFinishingOptions = nextLines.some(line => 
        line.startsWith('- ') && 
        !line.includes('- -') && 
        line.trim() !== '-'
      );

      if (!hasValidFinishingOptions) {
        // Remove the "Finishing Options:" line and any empty options
        lines.splice(finishingOptionsIndex);
      }
    }

    return lines;
  };

  const formatCustomerName = () => {
    if (!quote.customers) {
      return 'Unknown Customer';
    }
    return `${quote.customers.name} ${quote.customers.surname}`.trim() || 'Unknown Customer';
  };

  const getCustomerAddress = () => {
    if (!quote.customers) return [];

    return [
      quote.customers.street_address,
      quote.customers.complex_or_building,
      quote.customers.suburb,
      quote.customers.area,
      quote.customers.city,
      quote.customers.postal_code,
    ].filter(Boolean);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Image 
              src="/assets/ps_Logo.png"
              style={{ width: '60%', height: 'auto' }}
            />
          </View>
          <View style={styles.title}>
            <Text style={styles.titleText}>QUOTATION</Text>
            <Text style={styles.quoteRef}>Ref: {quote.quote_reference}</Text>
            <Text style={styles.quoteDate}>
              Date: {format(new Date(quote.date_created), 'dd MMMM yyyy')}
            </Text>
          </View>
        </View>

        {/* Addresses */}
        <View style={styles.addresses}>
          <View style={styles.addressBlock}>
            <Text style={styles.addressTitle}>From</Text>
            <Text style={styles.companyName}>Print Station</Text>
            <Text style={styles.addressText}>Parklands Lifestyle Centre</Text>
            <Text style={styles.addressText}>Parklands Main Road</Text>
            <Text style={styles.addressText}>Parklands, Cape Town</Text>
            <Text style={styles.addressText}>7441</Text>
            <Text style={styles.addressText}>South Africa</Text>
            <Text style={styles.addressText}>Tel: +27 21 557 9123</Text>
            <Text style={styles.addressText}>Email: info@printstation.co.za</Text>
          </View>

          <View style={styles.addressBlock}>
            <Text style={styles.addressTitle}>To</Text>
            <Text style={styles.companyName}>{formatCustomerName()}</Text>
            {quote.customers?.company_name && (
              <Text style={styles.addressText}>{quote.customers.company_name}</Text>
            )}
            {getCustomerAddress().map((line, index) => (
              <Text key={index} style={styles.addressText}>{line}</Text>
            ))}
            {quote.customers?.phone && (
              <Text style={styles.addressText}>Tel: {quote.customers.phone}</Text>
            )}
            {quote.customers?.email && (
              <Text style={styles.addressText}>Email: {quote.customers.email}</Text>
            )}
          </View>
        </View>

        {/* Quote Items */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.descriptionCol}>Description</Text>
            <Text style={styles.quantityCol}>Quantity</Text>
            <Text style={styles.totalCol}>Total</Text>
          </View>
          {quote.quote_items.map((item, index) => (
            <View key={item.item_id || index} style={styles.tableRow}>
              <View style={styles.descriptionCol}>
                {formatDescription(item.description).map((line, i) => (
                  <Text key={i} style={styles.descriptionText}>{line}</Text>
                ))}
              </View>
              <Text style={styles.quantityCol}>{item.quantity}</Text>
              <Text style={styles.totalCol}>{formatCurrency(item.total)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{formatCurrency(quote.subtotal)}</Text>
          </View>

          {(quote.discount_percentage || quote.discount_value) && (
            <>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  Discount {quote.discount_percentage ? `(${quote.discount_percentage}%)` : ''}:
                </Text>
                <Text style={styles.discountValue}>
                  -{formatCurrency(quote.discount_value || 0)}
                </Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal (after discount):</Text>
                <Text style={styles.totalValue}>
                  {formatCurrency(quote.subtotal_after_discount || 0)}
                </Text>
              </View>
            </>
          )}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>VAT (15%):</Text>
            <Text style={styles.totalValue}>{formatCurrency(quote.vat)}</Text>
          </View>

          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text style={styles.grandTotalLabel}>Total:</Text>
            <Text style={styles.grandTotalValue}>{formatCurrency(quote.total)}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Finnsen Technologies CC T/A Print Station | Registration No: 2001/024917/23 | VAT No: 4630173797</Text>
          <Text>Parklands Lifestyle Centre, Main Road, Parklands, 7441 | Tel: +27 21 557 9123 | Email: info@printstation.co.za</Text>
        </View>
      </Page>
    </Document>
  );
}
