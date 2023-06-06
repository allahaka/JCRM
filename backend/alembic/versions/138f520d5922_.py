"""empty message

Revision ID: 138f520d5922
Revises: 7918f89af248
Create Date: 2023-05-20 15:26:49.783490

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '138f520d5922'
down_revision = '7918f89af248'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('company',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.Column('email', sa.String(length=50), nullable=False),
    sa.Column('phone_number', sa.String(length=20), nullable=False),
    sa.Column('address', sa.String(length=50), nullable=False),
    sa.Column('country', sa.String(length=50), nullable=False),
    sa.Column('business_field', sa.String(length=50), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('name'),
    sa.UniqueConstraint('phone_number')
    )
    op.create_index(op.f('ix_company_id'), 'company', ['id'], unique=False)
    op.create_table('employee',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.Column('wid', sa.String(length=50), nullable=False),
    sa.Column('email', sa.String(length=50), nullable=False),
    sa.Column('phone_number', sa.String(length=20), nullable=False),
    sa.Column('address', sa.String(length=50), nullable=False),
    sa.Column('position', sa.String(length=50), nullable=False),
    sa.Column('company_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['company_id'], ['company.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('name'),
    sa.UniqueConstraint('phone_number'),
    sa.UniqueConstraint('wid')
    )
    op.create_index(op.f('ix_employee_id'), 'employee', ['id'], unique=False)
    op.create_table('deal',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.Column('description', sa.String(length=50), nullable=False),
    sa.Column('budget', sa.Integer(), nullable=False),
    sa.Column('currency', sa.String(length=50), nullable=False),
    sa.Column('status', sa.String(length=50), nullable=False),
    sa.Column('company_id', sa.Integer(), nullable=False),
    sa.Column('contact_point_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['company_id'], ['company.id'], ),
    sa.ForeignKeyConstraint(['contact_point_id'], ['employee.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('description'),
    sa.UniqueConstraint('name')
    )
    op.create_index(op.f('ix_deal_id'), 'deal', ['id'], unique=False)
    op.create_table('meeting',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=50), nullable=False),
    sa.Column('description', sa.String(length=50), nullable=False),
    sa.Column('organizer', sa.Integer(), nullable=False),
    sa.Column('date', sa.Date(), nullable=False),
    sa.Column('deal_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['deal_id'], ['deal.id'], ),
    sa.ForeignKeyConstraint(['organizer'], ['employee.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('title')
    )
    op.create_index(op.f('ix_meeting_id'), 'meeting', ['id'], unique=False)
    op.create_table('note',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=50), nullable=False),
    sa.Column('description', sa.String(length=50), nullable=False),
    sa.Column('deal_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['deal_id'], ['deal.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('description'),
    sa.UniqueConstraint('title')
    )
    op.create_index(op.f('ix_note_id'), 'note', ['id'], unique=False)
    op.drop_index('email', table_name='user')
    op.drop_index('ix_user_id', table_name='user')
    op.drop_index('name', table_name='user')
    op.drop_index('phone_number', table_name='user')
    op.drop_table('user')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('id', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('name', mysql.VARCHAR(length=50), nullable=False),
    sa.Column('email', mysql.VARCHAR(length=50), nullable=False),
    sa.Column('phone_number', mysql.VARCHAR(length=20), nullable=False),
    sa.Column('address', mysql.VARCHAR(length=50), nullable=False),
    sa.Column('country', mysql.VARCHAR(length=50), nullable=False),
    sa.Column('business_field', mysql.VARCHAR(length=50), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_index('phone_number', 'user', ['phone_number'], unique=False)
    op.create_index('name', 'user', ['name'], unique=False)
    op.create_index('ix_user_id', 'user', ['id'], unique=False)
    op.create_index('email', 'user', ['email'], unique=False)
    op.drop_index(op.f('ix_note_id'), table_name='note')
    op.drop_table('note')
    op.drop_index(op.f('ix_meeting_id'), table_name='meeting')
    op.drop_table('meeting')
    op.drop_index(op.f('ix_deal_id'), table_name='deal')
    op.drop_table('deal')
    op.drop_index(op.f('ix_employee_id'), table_name='employee')
    op.drop_table('employee')
    op.drop_index(op.f('ix_company_id'), table_name='company')
    op.drop_table('company')
    # ### end Alembic commands ###
