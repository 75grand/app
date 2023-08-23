import Grid from '../Grid';
import Input, { InputProps } from '../Input';
import InputLabel from '../InputLabel';

interface Props {
    mailboxNumber: InputProps['value'],
    setMailboxNumber: InputProps['setValue'],
    mailboxCombination: InputProps['value'],
    setMailboxCombination: InputProps['setValue'],
}

export default function MailboxInput(props: Props) {
    return (
        <Grid columns={2}>
            <InputLabel text="Mailbox Number">
                <Input
                    value={props.mailboxNumber}
                    setValue={props.setMailboxNumber}
                    placeholder="1605"
                    maxLength={4}
                    inputMode="numeric"
                    returnKeyType="done"
                />
            </InputLabel>

            <InputLabel text="Mailbox Combination">
                <Input
                    value={props.mailboxCombination}
                    setValue={props.setMailboxCombination}
                    placeholder="33-05-27"
                    maxLength={8}
                    mask={[/[0-4]/, /\d/, '-', /[0-4]/, /\d/, '-', /[0-4]/, /\d/]}
                    inputMode="numeric"
                    returnKeyType="done"
                />
            </InputLabel>
        </Grid>
    );
}