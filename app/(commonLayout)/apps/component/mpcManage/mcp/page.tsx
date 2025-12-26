import my_test from './Apps';
const MyTest = my_test;
const Component = (props: any) => {
    return <div>
        <MyTest props />
    </div>
};
export default Component;