import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await query(`
      SELECT mt.name, tc.name AS category, u.name AS unit, mt.normalmin, mt.normalmax
      FROM medicaltests mt
      JOIN testcategories tc ON mt.idcategory = tc.id
      JOIN uom u ON mt.iduom = u.id;
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}