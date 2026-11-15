/* eslint-disable @next/next/no-img-element */
import { getStore } from '@/lib/store';
import { removePhotoAction, updateProductAction, uploadPhotoAction } from '../../actions';

export default async function AdminCartePage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams;
  const catalog = await getStore().getCatalog({ includeInactive: true });
  const current = catalog.categories.find((c) => c.id === cat) ? cat! : catalog.categories[0].id;
  const list = catalog.products.filter((p) => p.cat === current);
  const c = catalog.categories.find((x) => x.id === current)!;

  return (
    <>
      <div><h1>Carte, prix &amp; photos</h1><p className="muted">Modifiez un prix, ajoutez une photo ou mettez un plat en pause : le site se met à jour tout de suite.</p></div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {catalog.categories.map((x) => <a key={x.id} href={`/admin/carte?cat=${x.id}`} className={'tab' + (x.id === current ? ' on' : '')} style={{ padding: '8px 14px', fontSize: 13 }}>{x.fr}</a>)}
      </div>
      <div className="box" style={{ overflow: 'hidden' }}>
        <div className="tbl-wrap">
          <table className="tbl" style={{ minWidth: 860 }}>
            <thead><tr><th>Photo</th><th>Produit</th><th>{c.id === 'sauces' ? '250 ml' : c.id === 'starters' ? '5–50 pcs (lot de 5)' : 'Regular / prix'}</th><th>{c.id === 'sauces' ? '500 ml' : c.id === 'starters' ? '51–100 pcs' : 'Large'}</th><th>Vedette</th><th>En ligne</th><th /></tr></thead>
            <tbody>
              {list.map((p) => {
                const fid = 'f-' + p.id;
                return (
                  <tr key={p.id} style={{ opacity: p.active === false ? 0.6 : 1 }}>
                    <td style={{ width: 150 }}>
                      {p.photo ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <img src={p.photo} alt="" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 10 }} />
                          <form action={removePhotoAction}><input type="hidden" name="id" value={p.id} /><button className="link-btn" type="submit">Retirer</button></form>
                        </div>
                      ) : null}
                      <form action={uploadPhotoAction} style={{ marginTop: p.photo ? 6 : 0 }}>
                        <input type="hidden" name="id" value={p.id} />
                        <label style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, border: '1.5px dashed #C9B8A6', borderRadius: 10, padding: '6px 10px', fontSize: 12.5, fontWeight: 700, color: 'var(--rust-dark)', cursor: 'pointer' }}>
                          {p.photo ? 'Changer' : '+ Photo'}
                          <input type="file" name="photo" accept="image/jpeg,image/png,image/webp" className="sr-only" />
                        </label>
                        <button type="submit" className="link-btn" style={{ marginLeft: 6 }}>Envoyer</button>
                      </form>
                    </td>
                    <td><strong>{p.fr}</strong>{p.side ? <div className="muted" style={{ fontSize: 12 }}>+ 1 accompagnement</div> : null}<div className="muted" style={{ fontSize: 11.5 }}>{p.id}</div></td>
                    <td><input form={fid} name="r" className="pin" inputMode="decimal" defaultValue={p.r} aria-label={`Prix ${p.fr}`} /></td>
                    <td>{p.sizes === 'single' ? <span className="muted">—</span> : <input form={fid} name="l" className="pin" inputMode="decimal" defaultValue={p.l ?? ''} aria-label={`Prix Large ${p.fr}`} />}</td>
                    <td><input form={fid} type="checkbox" name="featured" defaultChecked={!!p.featured} aria-label="Plat vedette" style={{ width: 20, height: 20 }} /></td>
                    <td><input form={fid} type="checkbox" name="active" defaultChecked={p.active !== false} aria-label="En ligne" style={{ width: 20, height: 20 }} /></td>
                    <td><form id={fid} action={updateProductAction}><input type="hidden" name="id" value={p.id} /><button type="submit" className="btn btn-dark btn-sm">Enregistrer</button></form></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <p className="muted" style={{ fontSize: 13 }}>Photos : JPG, PNG ou WebP, 5 Mo maximum. Choisissez le fichier puis cliquez sur « Envoyer ». « Vedette » met le plat en avant sur l&apos;accueil.</p>
    </>
  );
}
